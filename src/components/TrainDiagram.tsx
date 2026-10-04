import NetworkDiagram from './NetworkDiagram';
import { trainStations, trainLines } from '@/data/trainData';
export default function TrainDiagram() {
  return <NetworkDiagram stations={trainStations} lines={trainLines} label="Kolkata suburban train" />;
}
