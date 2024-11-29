"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Building Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "development_type",
    header: "Development Type",
  },
  {
    accessorKey: "price_range",
    header: "Price Range",
  },
  {
    accessorKey: "architectural_theme",
    header: "Architectural Theme",
  },
  {
    accessorKey: "lat",
    header: "Lattitude",
  },
  {
    accessorKey: "lng",
    header: "Longitude",
  },

  {
    id: "actions",
    cell: ({ row, viewType }) => {
      const payment = row.original;
      const fetchProperties = async () => {
        // Assuming you have this function defined elsewhere
        try {
          const response = await fetch(
            "https://infinitech-testing1.online/api/admin/properties"
          ); // Fetch properties API
          const data = await response.json();
          return data; // Return fetched properties
        } catch (error) {
          console.error("Failed to fetch properties:", error);
          return []; // Return an empty array in case of an error
        }
      };
      const fetchBuildings = async () => {
        try {
          const response = await fetch(
            "https://infinitech-testing1.online/api/admin/buildings"
          ); // Fetch buildings API
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
          const response = await fetch(
            "https://infinitech-testing1.online/api/admin/facilities"
          );
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
          const response = await fetch(
            "https://infinitech-testing1.online/api/admin/features"
          ); // Fetch features API
          const data = await response.json();
          console.log(data);
          return data; // Return fetched properties
        } catch (error) {
          console.error("Failed to fetch properties:", error);
          return []; // Return an empty array in case of an error
        }
      };
      const handleDelete = async (ids, viewType) => {
        // Log the ids to check if they are in an array format
        console.log(ids);

        // If ids is a single ID (not an array), wrap it in an array
        const idsToDelete = Array.isArray(ids) ? ids : [ids];

        let url;
        if (viewType === "property") {
          url = "https://infinitech-testing1.online/api/admin/deleteproperty";
        } else if (viewType === "buildings") {
          url = "https://infinitech-testing1.online/api/admin/deletebuilding";
        } else if (viewType === "feature") {
          url = "https://infinitech-testing1.online/api/admin/deletefeature";
        } else if (viewType === "facility") {
          url = "https://infinitech-testing1.online/api/admin/deletefacility";
        } else {
          console.error("Invalid viewType");
          return;
        }

        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: idsToDelete }), // Always send an array of IDs
          });

          if (!response.ok) {
            throw new Error(`Error deleting items: ${response.statusText}`);
          }

          const result = await response.json();
          fetchProperties();
          console.log(result); // Log the success message from the backend
        } catch (error) {
          console.error("Error:", error);
        }
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy Property ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Add Other Building</DropdownMenuItem>
              <DropdownMenuItem>Add Building Details</DropdownMenuItem>
              <DropdownMenuItem>Update Property</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(payment.id, "property")}
              >
                Delete Property
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDelete(payment.id, "buildings")}
              >
                Delete Other Buildings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDelete(payment.id, "feature")}
              >
                Delete Feature
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(payment.id, "facility")}
              >
                Delete Facilities
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },

  // other columns...
];
