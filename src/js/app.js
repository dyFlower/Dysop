import Dysop from './components/dysop.js';
import SlotGenerator from './components/slotGenerator.js';

const dysop = new Dysop();
const slotGenerator = new SlotGenerator();

await slotGenerator.setup();
dysop.setup();
