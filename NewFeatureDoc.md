## New Feature: Landlord's Income Breakdown

This new feature is a bit complex but remains straightforward to use. It functions as an income breakdown calculator for landlords, providing a detailed analysis of all costs incurred throughout the year by their property management company.

### Feature Overview
This is not just a simple calculator—it is a comprehensive financial breakdown table that helps landlords track their income and expenses efficiently.

### Table Structure
The table should include the following columns:

- **Month**: Name and Year (e.g., _February 2024_)
- **Rent**: Rent Amount for the Month (e.g., _$2650_)
- **Realtor Fees**: Fees charged for property management (e.g., _$180.35_)
- **Home Insurance**: Home Insurance for the Month (e.g., _$97_)
- **Property Maintenance**: Monthly Maintenance Costs (e.g., _$466_)
- **Council & Emergency Levy**: Charges related to council and emergency levies (e.g., _$895.05_)
- **Water & Sewer**: Monthly Water & Sewer expenses (e.g., _$240.81_)
- **Electricity**: Monthly Electricity Bill (e.g., _$123.45_)
- **Gas**: Monthly Gas Bill (e.g., _$123.45_)
- **Tenant Paid Bills**: Amount paid by the tenant (e.g., _$449.78_)
- **Final Income**: Net income after deductions (e.g., _$449.78_)

### Calculation Logic
The income breakdown follows this formula:

1. **Income Calculation**
   \[
   \text{Final Income} = \text{Total Income} - \text{Expenses}
   \]

2. **Home Loan Interest Deduction**
   \[
   \text{Home Loan Interest} = \text{Income} - 3.5\%
   \]
   Example:
   \[
   449.78 - 3.5\% = \text{Home Loan Interest}
   \]

3. **Total Remaining Income**
   \[
   \text{Total} = \text{Income} - \text{Home Loan Interest}
   \]
   Example:
   \[
   449.78 - 449.78 = 0.00
   \]

### Functionalities
- **Calculate Button**: Clicking this button will compute and update the table data based on the above calculations.
- **Download CSV Button**: This button will generate and download the table data in CSV format, including the header row. The filename will automatically include the current date.

### Implementation Details
- The **ShadCN Table Component** will be used to display the table data.
- The feature will be placed in a separate section called **"Landlord's Income Breakdown"**, under the **"Lease Break Calculators"** section.
- A **Navigation Menu Link** will be added to provide easy access to this feature.

### Example: ShadCN Table Component
Below is an example of how the ShadCN table component will be structured:
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function LandlordIncomeTable({ data }) {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Rent</TableHead>
            <TableHead>Realtor Fees</TableHead>
            <TableHead>Home Insurance</TableHead>
            <TableHead>Property Maintenance</TableHead>
            <TableHead>Council & Emergency Levy</TableHead>
            <TableHead>Water & Sewer</TableHead>
            <TableHead>Electricity</TableHead>
            <TableHead>Gas</TableHead>
            <TableHead>Tenant Paid Bills</TableHead>
            <TableHead>Final Income</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.month}</TableCell>
              <TableCell>{row.rent}</TableCell>
              <TableCell>{row.realtorFees}</TableCell>
              <TableCell>{row.homeInsurance}</TableCell>
              <TableCell>{row.propertyMaintenance}</TableCell>
              <TableCell>{row.councilEmergencyLevy}</TableCell>
              <TableCell>{row.waterSewer}</TableCell>
              <TableCell>{row.electricity}</TableCell>
              <TableCell>{row.gas}</TableCell>
              <TableCell>{row.tenantPaidBills}</TableCell>
              <TableCell>{row.finalIncome}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex gap-2">
        <Button onClick={calculateIncome}>Calculate</Button>
        <Button onClick={downloadCSV}>Download CSV</Button>
      </div>
    </div>
  );
}
```

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
```