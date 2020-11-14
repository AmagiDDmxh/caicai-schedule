import { DateSelect } from "./components/Datepicker";

export interface Student {
  name: string;
  building: number;
  id: string;
  workdays: DateSelect[];
  isManager?: boolean;
  total: number;
  gender: boolean;
  unavailables: number[];
}
