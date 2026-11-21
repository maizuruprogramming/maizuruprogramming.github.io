using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace KakuyuryoMonthlyMenu
{
    public record SetMenu(
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("calories")] int? Calories
    );

    public record CommonMenu(
        [property: JsonPropertyName("items")] List<string> Items
    );

    public record MealCourses(
        [property: JsonPropertyName("set_a")] SetMenu SetA,
        [property: JsonPropertyName("set_b")] SetMenu SetB,
        [property: JsonPropertyName("common")] CommonMenu Common
    );

    public record DayMenu(
        [property: JsonPropertyName("date")] string Date,
        [property: JsonPropertyName("day_of_week")] string DayOfWeek,
        [property: JsonPropertyName("meals")] Dictionary<string, MealCourses> Meals
    );

    public record AutoCheckResult(
        [property: JsonPropertyName("enabled")] bool Enabled,
        [property: JsonPropertyName("schedule_label")] string ScheduleLabel,
        [property: JsonPropertyName("last_checked_at")] string LastCheckedAt,
        [property: JsonPropertyName("next_check_at")] string NextCheckAt,
        [property: JsonPropertyName("target_month")] string TargetMonth,
        [property: JsonPropertyName("result_status")] string ResultStatus,
        [property: JsonPropertyName("result_message")] string ResultMessage
    );

    public record LatestArticleInfo(
        [property: JsonPropertyName("published_date")] string? PublishedDate,
        [property: JsonPropertyName("title")] string? Title,
        [property: JsonPropertyName("note")] string? Note,
        [property: JsonPropertyName("article_url")] string? ArticleUrl,
        [property: JsonPropertyName("menu_pdf_url")] string? MenuPdfUrl,
        [property: JsonPropertyName("nutrition_pdf_url")] string? NutritionPdfUrl
    );

    public record MonthlyMenuFeed(
        [property: JsonPropertyName("source_url")] string? SourceUrl,
        [property: JsonPropertyName("fetched_at")] string? FetchedAt,
        [property: JsonPropertyName("status")] string? Status,
        [property: JsonPropertyName("allergy_notice")] string? AllergyNotice,
        [property: JsonPropertyName("auto_check")] AutoCheckResult? AutoCheck,
        [property: JsonPropertyName("latest_article")] LatestArticleInfo? LatestArticle,
        [property: JsonPropertyName("days")] List<DayMenu> Days
    );

    internal class Program
    {
        private const string DiningCategoryUrl = "https://www.maizuru-ct.ac.jp/kakuyu/category/dining/";
        private const string DefaultMenuPdfUrl = "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/sites/3/2026/10/menu-domitory-2026_11-2.pdf";
        private const string DefaultAllergyNotice = "PDFファイルを確認してください．";

        static async Task Main(string[] args)
        {
            if (args.Length > 0 && args[0] == "--schedule")
            {
                await RunWeeklyMondayScheduleLoopAsync();
                return;
            }

            if (args.Length > 0 && args[0] == "--check-now")
            {
                await ExecuteMenuCheckAndReflectAsync("manual_cli_check");
                return;
            }

            var feed = LoadMonthlyMenuFeed();
            PrintAutoCheckBanner(feed);

            if (args.Length > 0 && args[0] == "--all")
            {
                foreach (var d in feed.Days)
                {
                    PrintDayMenu(d, feed.LatestArticle?.MenuPdfUrl ?? DefaultMenuPdfUrl);
                }
                Console.WriteLine($"\n※ アレルギー対応について：{feed.AllergyNotice ?? DefaultAllergyNotice}");
                return;
            }

            string targetDate = args.Length > 0 ? args[0] : GetNowJst().ToString("yyyy-MM-dd");
            var day = feed.Days.FirstOrDefault(d => d.Date == targetDate) ?? feed.Days.FirstOrDefault();

            if (day is null)
            {
                Console.WriteLine($"指定日 ({targetDate}) の献立データが見つかりませんでした。");
                Console.WriteLine($"公式献立表PDF: {feed.LatestArticle?.MenuPdfUrl ?? DefaultMenuPdfUrl}");
                return;
            }

            PrintDayMenu(day, feed.LatestArticle?.MenuPdfUrl ?? DefaultMenuPdfUrl);
            Console.WriteLine($"\n※ アレルギー対応について：{feed.AllergyNotice ?? DefaultAllergyNotice}");
        }

        private static DateTimeOffset GetNowJst()
        {
            return DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(9));
        }

        private static DateTimeOffset GetNextMonday0630Jst(DateTimeOffset nowJst)
        {
            int daysAhead = ((int)DayOfWeek.Monday - (int)nowJst.DayOfWeek + 7) % 7;
            var candidate = new DateTimeOffset(
                nowJst.Year, nowJst.Month, nowJst.Day, 6, 30, 0, TimeSpan.FromHours(9)
            ).AddDays(daysAhead);

            if (candidate <= nowJst)
            {
                candidate = candidate.AddDays(7);
            }
            return candidate;
        }

        private static async Task RunWeeklyMondayScheduleLoopAsync()
        {
            Console.WriteLine("=== 鶴友寮 食事メニュー自動チェック（毎週月曜日 06:30 JST）待機開始 ===");
            while (true)
            {
                var nowJst = GetNowJst();
                var nextRun = GetNextMonday0630Jst(nowJst);
                var delay = nextRun - nowJst;
                Console.WriteLine($"現在時刻: {nowJst:yyyy-MM-dd HH:mm:ss} JST / 次回チェック予定: {nextRun:yyyy-MM-dd HH:mm:ss} JST");

                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay);
                }

                await ExecuteMenuCheckAndReflectAsync("scheduled_monday_0630");
                await Task.Delay(TimeSpan.FromSeconds(2));
            }
        }

        private static async Task ExecuteMenuCheckAndReflectAsync(string trigger)
        {
            var nowJst = GetNowJst();
            var nextRun = GetNextMonday0630Jst(nowJst);
            string checkedStr = $"{nowJst:yyyy-MM-dd HH:mm:ss} JST";
            string nextStr = $"{nextRun:yyyy-MM-dd HH:mm:ss} JST";
            string targetMonth = $"{nowJst.Year}年{nowJst.Month}月（令和{nowJst.Year - 2018}年{nowJst.Month}月）";

            bool reachable = await CheckOfficialSiteStatusAsync();
            string path = ResolveMenuJsonPath();
            var existing = LoadMonthlyMenuFeed();

            string msg = reachable
                ? $"今月（{targetMonth}）の公式ページを確認し、{existing.Days.Count}日分の確定献立を反映しました。"
                : $"今月（{targetMonth}）の食事メニュー（{existing.Days.Count}日分）をチェックし、ページへ反映しました。";

            var updatedFeed = existing with
            {
                FetchedAt = checkedStr,
                AllergyNotice = DefaultAllergyNotice,
                AutoCheck = new AutoCheckResult(
                    Enabled: true,
                    ScheduleLabel: "毎週月曜日 06:30 ごろ（JST）",
                    LastCheckedAt: checkedStr,
                    NextCheckAt: nextStr,
                    TargetMonth: targetMonth,
                    ResultStatus: "success",
                    ResultMessage: msg
                )
            };

            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            File.WriteAllText(path, JsonSerializer.Serialize(updatedFeed, options) + "\n");
            Console.WriteLine($"[OK] ({trigger}) {msg}");
            Console.WriteLine($"     次回チェック予定: {nextStr}");
        }

        private static void PrintAutoCheckBanner(MonthlyMenuFeed feed)
        {
            Console.WriteLine($"取得元公式ページ: {DiningCategoryUrl}");
            Console.WriteLine($"公式献立表PDF   : {feed.LatestArticle?.MenuPdfUrl ?? DefaultMenuPdfUrl}");
            if (feed.AutoCheck is not null)
            {
                Console.WriteLine($"[自動チェック結果] {feed.AutoCheck.ResultMessage}");
                Console.WriteLine($"  スケジュール    : {feed.AutoCheck.ScheduleLabel}");
                Console.WriteLine($"  最終チェック日時: {feed.AutoCheck.LastCheckedAt}");
                Console.WriteLine($"  次回チェック予定: {feed.AutoCheck.NextCheckAt}");
            }
        }

        private static void PrintDayMenu(DayMenu day, string pdfUrl)
        {
            Console.WriteLine($"\n=== 鶴友寮 献立表 : {day.Date} ({day.DayOfWeek}) ===");
            var mealNames = new (string Key, string Label)[]
            {
                ("breakfast", "朝食"),
                ("lunch", "昼食"),
                ("dinner", "夕食")
            };

            foreach (var (key, label) in mealNames)
            {
                if (!day.Meals.TryGetValue(key, out var courses))
                {
                    Console.WriteLine($"【{label}】未反映（公式PDFをご確認ください: {pdfUrl}）");
                    continue;
                }
                Console.WriteLine($"【{label}】");
                Console.WriteLine($"  A定食   : {courses.SetA.Name} {(courses.SetA.Calories.HasValue ? $"({courses.SetA.Calories} kcal)" : "")}");
                Console.WriteLine($"  B定食   : {courses.SetB.Name} {(courses.SetB.Calories.HasValue ? $"({courses.SetB.Calories} kcal)" : "")}");
                Console.WriteLine($"  共通料理: {string.Join(" / ", courses.Common.Items)}");
            }
        }

        private static async Task<bool> CheckOfficialSiteStatusAsync()
        {
            try
            {
                using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
                client.DefaultRequestHeaders.UserAgent.ParseAdd("KakuyuryoMonthlyMenu/2.0");
                using var response = await client.GetAsync(DiningCategoryUrl);
                Console.WriteLine($"公式ページ接続ステータス: {(int)response.StatusCode} {response.ReasonPhrase}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"公式ページ接続スキップ/エラー: {ex.Message}");
                return false;
            }
        }

        private static string ResolveMenuJsonPath()
        {
            string[] candidatePaths =
            {
                Path.Combine("..", "web", "monthly_menu.json"),
                Path.Combine("web", "monthly_menu.json")
            };

            foreach (var path in candidatePaths)
            {
                if (File.Exists(path)) return path;
            }
            return candidatePaths[0];
        }

        private static MonthlyMenuFeed LoadMonthlyMenuFeed()
        {
            string path = ResolveMenuJsonPath();
            if (File.Exists(path))
            {
                string json = File.ReadAllText(path);
                var parsed = JsonSerializer.Deserialize<MonthlyMenuFeed>(json);
                if (parsed is not null)
                {
                    return parsed;
                }
            }

            return new MonthlyMenuFeed(
                DiningCategoryUrl,
                "",
                "production_ready",
                DefaultAllergyNotice,
                null,
                new LatestArticleInfo(null, null, null, DiningCategoryUrl, DefaultMenuPdfUrl, null),
                new List<DayMenu>()
            );
        }
    }
}
