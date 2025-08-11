export const MAX_SIZE_BYTES = 15728640;

// NOTE(jimmylee):
// https://github.com/internet-development/apis
// export const API = `http://localhost:10001/api`;
export const API = `https://api.internet.dev/api`;

export const Users = {
  tiers: {
    UNVERIFIED: 0,
    VERIFIED: 10,
    PAYING: 20,
    GENERAL_CO_WORKING: 30,
    PARTNER: 40,
    ADMIN: 100,
  },
};

export const Tiers = {
  PAYING: 899,
  GENERAL_CO_WORKING: 32900,
  PARTNER: 279000,
};

export const Payments = {
  899: 'PAYING',
  32900: 'GENERAL_CO_WORKING',
  279000: 'PARTNER',
};

export const Payouts = {
  PAYING: 1500,
  GENERAL_CO_WORKING: 45000,
  PARTNER: 45000,
};

export const LANDSCAPES = [
  ['Sahara Desert', 'The Sahara stretches across North Africa with shifting dunes that tower above the horizon. Even in its harsh sunlight and cold nights, resilient life finds a way to endure.'],
  ['Grand Canyon', 'Carved by the Colorado River, the Grand Canyon reveals layers of ancient rock. Its chasms echo with wind and the distant calls of raptors gliding through the afternoon sky.'],
  ['Amazon Rainforest', 'The Amazon Rainforest teems with biodiversity under a dense green canopy. Rivers and flooded plains sustain countless species, while humid air hangs heavy with the promise of storms.'],
  ['Rocky Mountains', 'The Rockies rise like rugged spines across the continent. Snowpack feeds rivers that carve valleys where elk graze, and fir trees cling to the slopes.'],
  ['Gobi Desert', 'The Gobi Desert rolls out in arid sweeps across northern China and southern Mongolia. Sparse grasses and hardy camels testify to its unforgiving climate.'],
  ['Andes Mountains', 'The Andes dominate western South America with ragged peaks and hidden valleys. Llamas graze on high plateaus, and glaciers feed the rivers far below.'],
  ['Serengeti Plains', 'The Serengeti spreads under the African sun in rolling grasslands. Wildebeests and zebras migrate in vast herds, guided by the promise of water and fresh pasture.'],
  ['Yosemite Valley', 'Glacial forces shaped this granite cradle in California. Towering waterfalls cascade from sheer cliffs, while giant sequoias stand in quiet strength.'],
  ['Namib Desert', 'The Namib Desert clings to the Atlantic coast of southern Africa. Rust-red dunes shift above hidden water tables where desert elephants roam.'],
  ['Patagonia', 'Patagonia’s windswept plains and jagged peaks stretch across Argentina and Chile. Glaciers calve into turquoise lakes, and guanacos graze on hardy grasses.'],
  ['Swiss Alps', 'The Swiss Alps rise with sharp spires of snow and ice. Mountain chalets cling to slopes where wildflowers bloom each summer in vibrant displays.'],
  ['Himalayas', 'The Himalayas hold the world’s highest summits beneath a freezing sky. From lush foothills to lofty glaciers, this range tests life’s resilience.'],
  ['Icelandic Highlands', 'Iceland’s interior stands stark and raw with volcanic plains, steaming vents, and glacier-fed rivers. The wind sweeps across moss-coated lava fields in lonely gusts.'],
  ['Atacama Desert', 'The Atacama is among the driest places on Earth. Its scorched soil and salt flats see rare blooms that burst into color after elusive rains.'],
  ['Redwood Forest', 'Coastal redwoods tower in perpetual mist along the Pacific. Their trunks, thick and ancient, cradle a hidden world of fern and moss.'],
  ['Scottish Highlands', 'The Highlands roll in rugged hills capped by heather and stone. Lochs reflect ever-shifting skies, and the wind carries the distant clang of sheep bells.'],
  ['Great Rift Valley', 'This massive geological trench cleaves eastern Africa, where lakes shimmer at the bottom of steep escarpments. Flamingos gather in vast flocks to feed on algae.'],
  ['Okavango Delta', 'The Okavango spreads like a bright labyrinth of channels and wetlands in Botswana. Seasonal floods create a green haven for elephants, lions, and hippos.'],
  ['Appalachian Mountains', 'Old and eroded, the Appalachians meander through eastern North America. Their forests host black bears, rhododendrons, and the misty quiet of forest hollows.'],
  ['Death Valley', 'Death Valley bakes under a relentless sun, reaching some of the hottest temperatures on record. Cracked salt flats testify to evaporated lakes and lost water.'],
  ['Dolomites', 'Jagged limestone peaks define northern Italy’s Dolomites. Alpine meadows lie below sheer cliffs, where climbers test themselves against silent stone.'],
  ['Torres del Paine', 'Chile’s Torres del Paine juts into the southern sky with glacier-fed lakes at its base. Guanacos roam windblown plains as ice cracks overhead.'],
  ['Lofoten Islands', 'Lofoten’s dramatic peaks rise straight from Norway’s cold seas. Fishing villages huddle along rocky shores, while gulls circle overhead in crisp air.'],
  ['Siberian Tundra', 'The Siberian tundra spans a realm of permafrost and low shrubs. Winters stretch long and bleak, yet migratory birds still find respite here each summer.'],
  ['Norwegian Fjords', 'Deep fjords carve into Norway’s coast where dark waters mirror towering cliffs. Small farms cling to green patches between rock and sea.'],
  ['Bungle Bungle Range', 'These striped sandstone domes rise from the Australian outback. Gorges cut deep under a harsh sun, hiding pockets of lush vegetation.'],
  ['Zion Canyon', 'Zion Canyon glows red and orange under the Utah sky. The Virgin River sculpts sheer walls that watch over narrow trails and hidden pools.'],
  ['Lake Baikal', 'Lake Baikal in Siberia is the world’s deepest lake. Its waters shimmer with unmatched clarity, home to species found nowhere else on Earth.'],
  ['Banff National Park', 'Banff crowns the Canadian Rockies with turquoise lakes and towering peaks. Grizzlies roam pine forests while glacier-fed rivers reflect untouched wilderness.'],
  ['Wadi Rum', 'Wadi Rum’s sandstone cliffs loom in Jordan’s desert, carved by millennia of wind and time. Nomadic tribes wander under a silent, star-filled sky.'],
  ['Cappadocia', 'Cappadocia’s whimsical rock formations rise over central Turkey’s plains. Soft stone spires hold hidden chapels and the ghosts of ancient dwellers.'],
];

export const SAMPLE_TABLE_DATA_CHANGE_ME = [
  ['NAME', 'SYMBOL', 'PRICE', 'HOLDINGS'],
  ['Bat', 'BAT', '$9.01', '400'],
  ['Bear', 'BR', '$56.78', '200'],
  ['Camel', 'CML', '$55.67', '70'],
  ['Cheetah', 'CHT', '$13.45', '150'],
  ['Crab', 'CRB', '$15.67', '250'],
  ['Deer', 'DER', '$29.99', '110'],
  ['Dolphin', 'DLP', '$77.89', '50'],
  ['Eagle', 'EGL', '$45.67', '90'],
  ['Falcon', 'FLC', '$40.22', '85'],
  ['Fox', 'FOX', '$12.34', '100'],
  ['Frog', 'FRG', '$7.89', '400'],
  ['Giraffe', 'GRF', '$44.56', '80'],
  ['Hedgehog', 'HDG', '$11.23', '200'],
  ['Horse', 'HRS', '$54.32', '70'],
  ['Kangaroo', 'KNG', '$15.67', '120'],
  ['Koala', 'KLA', '$22.34', '150'],
  ['Leopard', 'LPR', '$14.56', '110'],
  ['Lemur', 'LMR', '$11.12', '320'],
  ['Lion', 'LION', '$67.89', '80'],
  ['Lynx', 'LNX', '$16.78', '130'],
  ['Mouse', 'MSE', '$5.12', '500'],
  ['Octopus', 'OCT', '$88.90', '40'],
  ['Otter', 'OTR', '$20.21', '180'],
  ['Owl', 'OWL', '$19.01', '160'],
  ['Panda', 'PND', '$78.90', '55'],
  ['Peacock', 'PCK', '$12.34', '100'],
  ['Penguin', 'PNG', '$33.45', '90'],
  ['Porcupine', 'PRC', '$17.89', '140'],
  ['Rabbit', 'RBT', '$9.10', '350'],
  ['Raccoon', 'RCC', '$18.90', '150'],
  ['Shark', 'SHK', '$89.01', '50'],
  ['Snake', 'SNK', '$10.11', '300'],
  ['Squirrel', 'SQL', '$10.12', '250'],
  ['Tiger', 'TGR', '$34.56', '120'],
  ['Turtle', 'TRL', '$66.78', '60'],
  ['Whale', 'WHL', '$123.45', '30'],
  ['Wolf', 'WLF', '$23.45', '150'],
  ['Zebra', 'ZBR', '$65.43', '60'],
];

export const CHESSBOARD_DEFAULT_POSITIONS: string[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

export const CHESSBOARD_BAD_BISHOP: string[][] = [
  ['r', ' ', ' ', 'q', ' ', 'r', 'k', ''],
  [' ', 'b', ' ', ' ', ' ', 'p', 'p', 'p'],
  ['p', '', 'p', 'b', 'p', 'n', '', ''],
  ['', '', 'p', 'p', '', '', '', ''],
  ['Q', '', '', 'P', '', '', '', ''],
  ['', '', 'P', '', 'P', 'N', 'B', ''],
  ['P', 'P', ' ', 'N', '', 'P', 'P', 'P'],
  ['R', ' ', ' ', ' ', 'K', ' ', ' ', 'R'],
];

export const CHESSBOARD_CHECKMATE_STEP_ONE: string[][] = [
  [' ', ' ', ' ', '', ' ', 'r', ' ', 'r'],
  ['p', 'b', ' ', 'n', ' ', 'p', ' ', 'k'],
  ['', 'q', '', 'N', 'p', '', '', ''],
  ['', 'p', 'p', 'n', 'P', '', 'Q', ''],
  ['', 'b', 'p', 'P', 'B', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', ' ', ' ', ' ', 'P', 'P', 'P'],
  ['R', ' ', ' ', ' ', ' ', 'R', 'K', ''],
];

export const CHESSBOARD_CHECKMATE_STEP_TWO: string[][] = [
  [' ', ' ', ' ', '', ' ', 'r', ' ', 'r'],
  ['p', 'b', ' ', 'n', ' ', ' ', ' ', 'k'],
  ['', 'q', '', 'N', 'p', '', '', ''],
  ['', 'p', 'p', 'n', 'P', 'p', 'Q', ''],
  ['', 'b', 'p', 'P', 'B', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', ' ', ' ', ' ', 'P', 'P', 'P'],
  ['R', ' ', ' ', ' ', ' ', 'R', 'K', ''],
];

export const CHESSBOARD_CHECKMATE_STEP_THREE: string[][] = [
  [' ', ' ', ' ', '', ' ', 'r', ' ', 'r'],
  ['p', 'b', ' ', 'n', ' ', ' ', ' ', 'k'],
  ['', 'q', '', 'N', 'p', 'P', '', ''],
  ['', 'p', 'p', 'n', '', '', 'Q', ''],
  ['', 'b', 'p', 'P', 'B', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', ' ', ' ', ' ', 'P', 'P', 'P'],
  ['R', ' ', ' ', ' ', ' ', 'R', 'K', ''],
];
