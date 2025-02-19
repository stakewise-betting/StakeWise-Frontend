import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import onGoingBets from "@/data/onGoingBets.json";
import { FaClock } from "react-icons/fa6";

export default function OngoingTable() {
  return (
    <div className="rounded-[20px] lg:mx-24 md:mx-16 mx-8 bg-[#333447]">
      <div className="p-8">
        <h2 className="text-[20px] font-bold">In-Progress Bets</h2>
        <p className="text-sm font-bold text-[#A0AEC0] flex items-center gap-2">
          <FaClock className="w-3 h-3 text-[#01B574]" />
          <p>25 bets on-going</p>
        </p>
      </div>
      <div className="md:px-16 px-8 pb-8">
        <Table className="">
          <TableHeader>
            <TableRow className=" border-[#56577A] hover:bg-transparent text-gray-400 font-medium lg:text-lg text-sm">
              <TableHead>EVENT NAME</TableHead>
              <TableHead>MARKET</TableHead>
              <TableHead>OUTCOME</TableHead>
              <TableHead>PRICE(ODDS)</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {onGoingBets.map((bet, index) => (
              <TableRow
                key={index}
                className="border-[#56577A] hover:bg-[#252537] lg:text-sm text-xs"
              >
                <TableCell>{bet.eventName}</TableCell>
                <TableCell>{bet.market}</TableCell>
                <TableCell>{bet.outcome}</TableCell>
                <TableCell>{bet.price}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-between">
                    {bet.status}
                    <button className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">⋮</span>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
