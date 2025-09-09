import { DestinationShelterType, SuppliesType } from "./types";

interface SupplyTableProps {
  supplies: SuppliesType[];
  destinationShelterLocation: DestinationShelterType;
}

const SupplyTable = ({
  supplies,
  destinationShelterLocation,
}: SupplyTableProps) => {
  return (
    <div className="flex flex-col items-center min-w-full">
      <p className="text-lg">{destinationShelterLocation.shelterName}</p>
      <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="px-6 py-3 text-sm font-semibold uppercase">Item</th>
            <th className="px-6 py-3 text-sm font-semibold uppercase">
              Delivered
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase">
              In Transit
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase">
              Delayed
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase">
              Consumed
            </th>
          </tr>
        </thead>
        <tbody>
          {supplies
            .filter(
              (supply) =>
                supply.shelterName === destinationShelterLocation.shelterName
            )
            .map((supply, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="border px-6 py-4 text-gray-800">
                  {supply.aidType}
                </td>
                <td className="border px-6 py-4 text-center">
                  {supply.delivered}
                </td>
                <td className="border px-6 py-4 text-center">
                  {supply.inTransit}
                </td>
                <td className="border px-6 py-4 text-center">
                  {supply.delayed}
                </td>
                <td className="border px-6 py-4 text-center">
                  {supply.consumed}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyTable;
