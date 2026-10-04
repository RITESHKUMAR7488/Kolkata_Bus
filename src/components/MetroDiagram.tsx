import NetworkDiagram from './NetworkDiagram';
import { metroStations, metroLines } from '@/data/metroData';
export default function MetroDiagram() {
  return <NetworkDiagram stations={metroStations} lines={metroLines} label="Kolkata Metro" />;
}
