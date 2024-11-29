"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React, { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const fetchProperties = async () => {
  // Assuming you have this function defined elsewhere
  try {
    const response = await fetch("https://infinitech-testing1.online/api/admin/properties"); // Fetch properties API
    const data = await response.json();
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchBuildings = async () => {
  try {
    const response = await fetch("https://infinitech-testing1.online/api/admin/buildings"); // Fetch buildings API
    // Fetch properties API
    const data = await response.json();
    console.log(data);
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchFacilities = async () => {
  try {
    const response = await fetch("https://infinitech-testing1.online/api/admin/facilities");
    const data = await response.json();
    console.log(data);
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchFeatures = async () => {
  try {
    const response = await fetch("https://infinitech-testing1.online/api/admin/features"); // Fetch features API
    const data = await response.json();
    console.log(data);
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
// DataTable Component
export function DataTable({ columns, data }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row
  const [otherBuildingsdata, setotherBuildingsData] = useState([]);
  const [facilityData, setFacilities] = useState([]);
  const [featureData, setFeatures] = useState([]);
  // Toggle expanded state when a row is clicked
  const handleRowClick = (rowId, value) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId)); // Toggle expanded state
    console.log(value.id);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const buildingresult = await fetchBuildings();
      setotherBuildingsData(buildingresult);

      const facilityresult = await fetchFacilities();
      setFacilities(facilityresult);

      const featureresult = await fetchFeatures(); // Fetch data from API

      // Log the raw response to see what we're getting from the API
      console.log("Fetched Features:", featureresult);

      // Check if the features field is a string and parse it
      const parsedFeatures = featureresult.map((feature) => {
        try {
          return {
            ...feature,
            features: feature.features ? JSON.parse(feature.features) : [],
          };
        } catch (error) {
          console.error("Error parsing features:", error);
          return feature; // Return as is in case of error
        }
      });

      // Set the parsed features into the state
      setFeatures(parsedFeatures);
    };

    fetchData();
  }, []);

  // Log updated state
  useEffect(() => {
    console.log("Updated facilitydata:", featureData); // Logs when the state updates
  }, [featureData]); // Dependency on otherBuildingsdata

  return (
    <>
      <div className="flex">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    {/* Main Table Row */}
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        console.log("Row clicked:", row.original); // Log the content of the clicked row
                        handleRowClick(row.id, row.original); // Toggle expanded state
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Content Row (Accordion) */}
                    {expandedRow === row.id && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="p-4 bg-white-100"
                        >
                          <Accordion type="single" collapsible>
                            <AccordionItem value={row.id.toString()}>
                              <AccordionTrigger>
                                Other Buildings
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Building Name</TableHead>
                                        <TableHead>Development Type</TableHead>
                                        <TableHead>
                                          Residential Levels
                                        </TableHead>
                                        <TableHead>
                                          Basement Parking Levels
                                        </TableHead>
                                        <TableHead>
                                          Podium Parking Levels
                                        </TableHead>
                                        <TableHead>Commercial Units</TableHead>
                                        <TableHead>
                                          Lower Ground Parking Levels
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {/* Filter the otherBuildingsdata to show only buildings that match the current row's ID */}
                                      {otherBuildingsdata.length > 0 ? (
                                        otherBuildingsdata
                                          .filter(
                                            (building) =>
                                              building.property_id ===
                                              row.original.id // Match the property_id with the row's id
                                          )
                                          .map((building) => (
                                            <TableRow key={building.id}>
                                              <TableCell>
                                                {building.name}
                                              </TableCell>
                                              <TableCell>
                                                {building.development_type}
                                              </TableCell>
                                              <TableCell>
                                                {building.residential_levels}
                                              </TableCell>
                                              <TableCell>
                                                {building.basement_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.podium_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.commercial_units ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.lower_ground_floor_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                            </TableRow>
                                          ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={7}>
                                            No buildings found
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value={`building-details-${row.id}`}>
                              <AccordionTrigger>
                                Building Details
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="rounded-md border p-4 overflow-y-auto ">
                                  <div className="flex space-x-6">
                                    {/* Building Features Table */}
                                    <div className="w-1/2  max-h-60 overflow-y-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Feature</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {featureData.length > 0 ? (
                                            featureData
                                              .filter(
                                                (feature) =>
                                                  feature.id === row.original.id
                                              ) // Match feature by id
                                              .map((featureItem) =>
                                                featureItem.features.map(
                                                  (feature, index) => (
                                                    <TableRow key={index}>
                                                      {" "}
                                                      {/* Use index as the key for each feature */}
                                                      <TableCell>
                                                        {feature.name}
                                                      </TableCell>
                                                    </TableRow>
                                                  )
                                                )
                                              )
                                          ) : (
                                            <TableRow>
                                              <TableCell
                                                colSpan={2}
                                                className="text-center"
                                              >
                                                No features found
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>

                                    {/* Building Facilities Table */}
                                    <div className="w-1/2 max-h-60 overflow-y-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Facilities</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {facilityData
                                            .filter(
                                              (facility) =>
                                                facility.property_id ===
                                                row.original.id
                                            ) // Filter by property_id
                                            .map((facility, index) => {
                                              const correspondingFeature =
                                                featureData
                                                  .filter(
                                                    (feature) =>
                                                      feature.property_id ===
                                                      row.original.id
                                                  )
                                                  .map((feature) => {
                                                    const features = JSON.parse(
                                                      feature.features
                                                    ); // Parse the features JSON string
                                                    return features.find(
                                                      (f) =>
                                                        f.name === facility.name
                                                    ); // Find the matching feature
                                                  })[0];

                                              return (
                                                <TableRow key={facility.id}>
                                                  <TableCell>
                                                    {facility.name}
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })}

                                          {facilityData.filter(
                                            (facility) =>
                                              facility.property_id ===
                                              row.original.id
                                          ).length === 0 && (
                                            <TableRow>
                                              <TableCell colSpan={3}>
                                                No facilities found
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <style jsx>
        {`
          .relative.w-full[style*="height: 300px;"] table.w-full thead tr th {
            /* Your styles for th */
          }
        `}
      </style>
    </>
  );
}
