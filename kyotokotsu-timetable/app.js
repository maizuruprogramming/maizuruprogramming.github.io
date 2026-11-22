const ROUTES = {
  umeda: {
    name: '舞鶴～大阪梅田', icon: '大', revision: '時刻表：2018年4月1日改正',
    url: 'https://www.kyotokotsu.jp/highway/course/maizuru_umeda.html',
    directionLabels: ['大阪行き', '舞鶴行き'],
    directions: {
      outbound: {
        label: '大阪行き', stops: ['舞鶴営業所（喜多）', '東舞鶴駅前', '中舞鶴', '西舞鶴駅前', '西宮北IC', '宝塚IC', '千里桃山台', '新大阪', '梅田'],
        trips: [
          { id: '511', times: ['6:35', '7:00', '7:06', '7:18', '8:35', '8:46', '9:04', '9:15', '9:25'] },
          { id: '513', times: ['—', '16:30', '16:36', '16:48', '18:05', '18:16', '18:30', '—', '18:40'] }
        ]
      },
      inbound: {
        label: '舞鶴行き', stops: ['梅田', '新大阪', '千里桃山台', '宝塚IC', '西宮北IC', '西舞鶴駅前', '中舞鶴', '東舞鶴駅前', '舞鶴営業所（喜多）'],
        trips: [
          { id: '510', times: ['8:50', '—', '9:00', '9:14', '9:25', '10:42', '10:54', '11:00', '—'] },
          { id: '512', times: ['17:10', '17:20', '17:31', '17:49', '18:00', '19:17', '19:29', '19:35', '20:00'] }
        ]
      }
    }
  },
  nanba: {
    name: '舞鶴～大阪なんば・伊丹空港', icon: '難', revision: '時刻表：2018年4月1日改正',
    url: 'https://www.kyotokotsu.jp/highway/course/maizuru-nanba.html',
    directionLabels: ['なんば・伊丹空港行き', '舞鶴行き'],
    directions: {
      outbound: {
        label: 'なんば・伊丹空港行き', stops: ['舞鶴営業所（喜多）', '東舞鶴駅前', '舞鶴FT', '中舞鶴', '西舞鶴駅前', '大阪伊丹空港', 'なんば（OCAT）'],
        trips: [
          { id: '571', times: ['5:35', '6:00', '—', '6:06', '6:18', '7:55', '8:17'], note: '伊丹空港は本便（1号車）のみ乗降できます。続行便では空港に停車しません。' },
          { id: '573', times: ['7:35', '8:00', '—', '8:06', '8:18', '—', '10:10'] },
          { id: '575', times: ['9:35', '10:00', '—', '10:06', '10:18', '11:55', '12:17'], note: '伊丹空港は本便（1号車）のみ乗降できます。続行便では空港に停車しません。' },
          { id: '577', times: ['—', '13:00', '—', '13:06', '13:18', '—', '15:10'] },
          { id: '579', times: ['14:35', '15:00', '—', '15:06', '15:18', '16:55', '17:17'], note: '伊丹空港は本便（1号車）のみ乗降できます。続行便では空港に停車しません。' },
          { id: '581', times: ['—', '18:00', '—', '18:06', '18:18', '—', '20:10'] }
        ]
      },
      inbound: {
        label: '舞鶴行き', stops: ['なんば（OCAT）', '大阪伊丹空港', '西舞鶴駅前', '中舞鶴', '東舞鶴駅前', '舞鶴FT', '舞鶴営業所（喜多）'],
        trips: [
          { id: '570', times: ['7:30', '—', '9:22', '9:34', '9:40', '—', '—'] },
          { id: '572', times: ['10:30', '10:52', '12:29', '12:41', '12:47', '—', '13:12'], note: '伊丹空港は本便（1号車）のみ乗降できます。続行便では空港に停車しません。' },
          { id: '574', times: ['13:30', '—', '15:22', '15:34', '15:40', '—', '—'] },
          { id: '576', times: ['15:30', '15:52', '17:29', '17:41', '17:47', '—', '18:12'], note: '伊丹空港は本便（1号車）のみ乗降できます。続行便では空港に停車しません。' },
          { id: '580', times: ['18:30', '18:52', '20:29', '20:41', '20:47', '—', '21:12'], note: '伊丹空港は本便（1号車）のみ乗降できます。続行便では空港に停車しません。' },
          { id: '582', times: ['20:30', '—', '22:22', '22:34', '22:40', '22:50', '23:15'], note: '舞鶴FTはフェリーの入出港がない場合、停車しないことがあります。' }
        ]
      }
    }
  },
  kobe: {
    name: '舞鶴～神戸三宮・神戸空港', icon: '神', revision: '時刻表：2026年7月18日改正',
    url: 'https://www.kyotokotsu.jp/highway/course/maizuru-kobe.html',
    directionLabels: ['神戸行き', '舞鶴行き'],
    directions: {
      outbound: {
        label: '神戸行き', stops: ['舞鶴営業所', '東舞鶴駅前', '舞鶴FT', '中舞鶴', '西舞鶴駅前', '神戸三宮', '神戸空港'],
        trips: [
          { id: '551', times: ['7:05', '7:30', '—', '7:36', '7:48', '9:32', '—'] },
          { id: '553', times: ['8:35', '9:00', '—', '9:06', '9:18', '11:00', '—'] },
          { id: '557', times: ['—', '11:40', '—', '11:46', '11:58', '13:40', '14:05'] },
          { id: '559', times: ['—', '14:40', '—', '14:46', '14:58', '16:40', '—'] },
          { id: '561', times: ['—', '16:40', '—', '16:46', '16:58', '18:40', '—'] },
          { id: '563', times: ['—', '19:00', '—', '19:06', '19:18', '21:00', '—'] },
          { id: '565', times: ['—', '21:15', '21:30', '21:36', '21:47', '23:26', '—'], note: '舞鶴FTはフェリーの入出港がない場合、停車しないことがあります。' }
        ]
      },
      inbound: {
        label: '舞鶴行き', stops: ['神戸空港', '神戸三宮', '西舞鶴駅前', '中舞鶴', '東舞鶴駅前', '舞鶴FT', '舞鶴営業所'],
        trips: [
          { id: '550', times: ['—', '8:00', '9:42', '9:54', '10:00', '—', '—'] },
          { id: '552', times: ['—', '11:00', '12:42', '12:54', '13:00', '—', '—'] },
          { id: '554', times: ['—', '13:00', '14:42', '14:54', '15:00', '—', '—'] },
          { id: '556', times: ['—', '15:00', '16:42', '16:54', '17:00', '—', '—'] },
          { id: '560', times: ['16:30', '17:00', '18:42', '18:54', '19:00', '—', '—'] },
          { id: '562', times: ['—', '18:00', '19:42', '19:54', '20:00', '—', '20:25'] },
          { id: '564', times: ['—', '20:00', '21:42', '21:54', '22:00', '22:10', '22:35'], note: '舞鶴FTはフェリーの入出港がない場合、停車しないことがあります。' }
        ]
      }
    }
  },
  kyoto: {
    name: '舞鶴～京都駅', icon: '京', revision: '時刻表：2024年6月1日改正',
    url: 'https://www.kyotokotsu.jp/highway/course/maizuru-kyoto.html',
    directionLabels: ['京都駅行き', '舞鶴行き'],
    directions: {
      outbound: {
        label: '京都駅行き', stops: ['舞鶴営業所（喜多）', '東舞鶴駅前', '中舞鶴', '西舞鶴駅前', '京都駅中央口（烏丸）'],
        trips: [
          { id: '701/2', times: ['5:20', '5:45', '5:51', '6:03', '7:40'], deadline: '前日19:00' },
          { id: '703/4', times: ['6:45', '7:10', '7:16', '7:28', '9:05'], deadline: '前日19:00' },
          { id: '705/6', times: ['9:05', '9:30', '9:36', '9:48', '11:25'], deadline: '8:45' },
          { id: '707/8', times: ['11:05', '11:30', '11:36', '11:48', '13:25'], deadline: '10:45' },
          { id: '709/10', times: ['—', '13:30', '13:36', '13:48', '15:25'], deadline: '13:10' },
          { id: '711/12', times: ['—', '17:30', '17:36', '17:48', '19:25'], deadline: '17:10' }
        ]
      },
      inbound: {
        label: '舞鶴行き', stops: ['京都駅中央口（烏丸）', '西舞鶴駅前', '中舞鶴', '東舞鶴駅前', '舞鶴営業所（喜多）'],
        trips: [
          { id: '700/1', times: ['8:20', '9:57', '10:09', '10:15', '10:40'], deadline: '前日19:00' },
          { id: '702/3', times: ['10:00', '11:37', '11:49', '11:55', '—'], deadline: '9:30' },
          { id: '704/5', times: ['13:30', '15:07', '15:19', '15:25', '—'], deadline: '13:00' },
          { id: '706/7', times: ['15:30', '17:07', '17:19', '17:25', '17:50'], deadline: '15:00' },
          { id: '708/9', times: ['17:40', '19:17', '19:29', '19:35', '20:00'], deadline: '17:10' },
          { id: '710/11', times: ['20:50', '22:27', '22:39', '22:45', '23:10'], deadline: '19:00' }
        ]
      }
    }
  }
};

let selectedRoute = 'umeda';
let selectedDirection = 'outbound';
let selectedStopIndex = 1;
let expandedTrip = null;

const routeGrid = document.getElementById('routeGrid');
const stopSelect = document.getElementById('stopSelect');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const tripList = document.getElementById('tripList');
const noResults = document.getElementById('noResults');

function currentDirection() {
  return ROUTES[selectedRoute].directions[selectedDirection];
}

function chooseDefaultStop() {
  const stops = currentDirection().stops;
  // 神戸線は、どちら向きでも神戸三宮を初期表示する。
  if (selectedRoute === 'kobe') {
    selectedStopIndex = Math.max(0, stops.findIndex(name => name === '神戸三宮'));
  // それ以外の路線は、舞鶴発は東舞鶴駅前、舞鶴行きは始発停留所を初期表示する。
  } else if (selectedDirection === 'outbound') {
    selectedStopIndex = Math.max(0, stops.findIndex(name => name === '東舞鶴駅前'));
  } else {
    selectedStopIndex = 0;
  }
}

function renderRouteInfo() {
  const route = ROUTES[selectedRoute];
  document.getElementById('selectedRouteIcon').textContent = route.icon;
  document.getElementById('selectedRouteName').textContent = route.name;
  document.getElementById('revisionText').textContent = route.revision;
  const routeLink = document.getElementById('officialRouteLink');
  routeLink.href = route.url;
  document.getElementById('outboundLabel').textContent = route.directionLabels[0];
  document.getElementById('inboundLabel').textContent = route.directionLabels[1];
  document.querySelectorAll('.route-card').forEach(button => {
    const active = button.dataset.route === selectedRoute;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.direction-button').forEach(button => {
    const active = button.dataset.direction === selectedDirection;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderStopSelect() {
  const stops = currentDirection().stops;
  stopSelect.innerHTML = '';
  stops.forEach((stop, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = stop;
    stopSelect.appendChild(option);
  });
  if (selectedStopIndex >= stops.length || selectedStopIndex < 0) selectedStopIndex = 0;
  stopSelect.value = String(selectedStopIndex);
}

function terminalForTrip(trip, direction) {
  const stops = direction.stops;
  for (let i = trip.times.length - 1; i >= 0; i--) {
    if (trip.times[i] !== '—') return { name: stops[i], time: trip.times[i] };
  }
  return null;
}

function matchesQuery(trip, direction, query) {
  if (!query) return true;
  const q = query.toLocaleLowerCase();
  const servedStops = direction.stops.filter((stop, index) => trip.times[index] && trip.times[index] !== '—' && stop.toLocaleLowerCase().includes(q));
  const searchable = [trip.id, trip.note || '', trip.deadline || '', ...servedStops, ...trip.times].join(' ').toLocaleLowerCase();
  return searchable.includes(q);
}

function createTripCard(trip, index, direction, selectedTime) {
  const terminal = terminalForTrip(trip, direction);
  const card = document.createElement('article');
  card.className = 'trip-card';

  const main = document.createElement('div');
  main.className = 'trip-main';
  const timeBlock = document.createElement('div');
  timeBlock.className = 'trip-time-block';
  const time = document.createElement('strong');
  time.className = 'trip-time';
  time.textContent = selectedTime;
  const timeLabel = document.createElement('span');
  timeLabel.className = 'trip-time-label';
  timeLabel.textContent = '乗車時刻';
  timeBlock.append(time, timeLabel);

  const info = document.createElement('div');
  info.className = 'trip-info';
  const number = document.createElement('span');
  number.className = 'trip-number';
  number.textContent = `便 ${trip.id}`;
  const arrival = document.createElement('span');
  arrival.className = 'trip-arrival';
  const arrivalLabel = document.createElement('small');
  arrivalLabel.textContent = '終点';
  arrival.append(arrivalLabel, document.createTextNode(terminal ? `${terminal.name} ${terminal.time}` : '—'));
  info.append(number, arrival);

  const detailButton = document.createElement('button');
  detailButton.className = 'detail-button';
  detailButton.type = 'button';
  detailButton.setAttribute('aria-label', `便 ${trip.id} の全停留所時刻を表示`);
  detailButton.setAttribute('aria-expanded', String(expandedTrip === `${selectedRoute}-${selectedDirection}-${trip.id}`));
  detailButton.textContent = '⌄';
  main.append(timeBlock, info, detailButton);

  const details = document.createElement('div');
  details.className = 'trip-details';
  const isExpanded = expandedTrip === `${selectedRoute}-${selectedDirection}-${trip.id}`;
  details.hidden = !isExpanded;
  const timeline = document.createElement('div');
  timeline.className = 'stop-timeline';
  direction.stops.forEach((stop, stopIndex) => {
    const row = document.createElement('div');
    row.className = 'timeline-row';
    if (stopIndex === selectedStopIndex) row.classList.add('is-selected');
    if (stopIndex === trip.times.length - 1) row.classList.add('is-terminal');
    if (trip.times[stopIndex] === '—') row.classList.add('is-no-stop');
    const stopName = document.createElement('span');
    stopName.textContent = stop;
    const stopTime = document.createElement('span');
    stopTime.className = 'timeline-time';
    stopTime.textContent = trip.times[stopIndex] || '—';
    row.append(stopName, stopTime);
    timeline.appendChild(row);
  });
  details.appendChild(timeline);
  if (trip.deadline) {
    const deadline = document.createElement('p');
    deadline.className = 'deadline';
    const strong = document.createElement('strong');
    strong.textContent = '予約受付締切';
    deadline.append(strong, document.createTextNode(trip.deadline));
    details.appendChild(deadline);
    const deadlineHelp = document.createElement('p');
    deadlineHelp.className = 'deadline';
    deadlineHelp.textContent = '京都交通予約センターでの電話受付締切時刻です。高速バスネットの締切時刻とは異なります。';
    details.appendChild(deadlineHelp);
  }
  if (trip.note) {
    const note = document.createElement('p');
    note.className = 'deadline';
    note.textContent = trip.note;
    details.appendChild(note);
  }
  detailButton.addEventListener('click', () => {
    const key = `${selectedRoute}-${selectedDirection}-${trip.id}`;
    expandedTrip = expandedTrip === key ? null : key;
    renderTrips();
  });
  card.append(main, details);
  return card;
}

function renderTrips() {
  const direction = currentDirection();
  const selectedStop = direction.stops[selectedStopIndex];
  const query = searchInput.value.trim();
  document.getElementById('stopHeading').textContent = `${selectedStop}からの時刻`;
  tripList.innerHTML = '';
  const trips = direction.trips
    .map((trip, index) => ({ trip, index }))
    .filter(({ trip }) => trip.times[selectedStopIndex] && trip.times[selectedStopIndex] !== '—')
    .filter(({ trip }) => matchesQuery(trip, direction, query))
    .sort((a, b) => toMinutes(a.trip.times[selectedStopIndex]) - toMinutes(b.trip.times[selectedStopIndex]));
  document.getElementById('resultsCount').textContent = `${trips.length}便`;
  trips.forEach(({ trip, index }) => tripList.appendChild(createTripCard(trip, index, direction, trip.times[selectedStopIndex])));
  noResults.hidden = trips.length !== 0;
  clearSearch.hidden = query.length === 0;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function updateAll({ resetStop = false } = {}) {
  if (resetStop) chooseDefaultStop();
  renderRouteInfo();
  renderStopSelect();
  expandedTrip = null;
  renderTrips();
}

routeGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-route]');
  if (!button || button.dataset.route === selectedRoute) return;
  selectedRoute = button.dataset.route;
  updateAll({ resetStop: true });
});

document.querySelectorAll('.direction-button').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.direction === selectedDirection) return;
    selectedDirection = button.dataset.direction;
    updateAll({ resetStop: true });
  });
});

stopSelect.addEventListener('change', () => {
  selectedStopIndex = Number(stopSelect.value);
  expandedTrip = null;
  renderTrips();
});
searchInput.addEventListener('input', renderTrips);
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  renderTrips();
  searchInput.focus();
});

updateAll();
