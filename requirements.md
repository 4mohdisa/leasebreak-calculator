# LeaseBreak Calculator
*SACAT-Compliant Reletting and Advertising Fee Calculator*

## Project Overview
A web application to calculate reletting and advertising fees according to SACAT (South Australian Civil and Administrative Tribunal) formulas for early lease termination.

## Core Features

### Advertising Fee Calculator

**Required Fields:**

1. **Agreed Term Dropdown:**
    - **Options:** 6 Months, 1 Year, 2 Years, 3 Years.
    - **Output:**
        - **`totalWeeksInTerm`**: Total weeks in the selected term.
        - **`threeQuartersOfTermWeeks`**: ¾ of the total weeks calculated for the term.

2. **Advertising Cost Input:**
    - **Variable Name:** `advertisingCost`: Total cost incurred for advertising.

3. **Weeks Left on Agreement:**
    - **Option 1**: Input field where users can directly enter the number of weeks left on the agreement.
        - **Variable Name:** `weeksRemaining`.
    - **Option 2**: Toggle-enabled date fields:
        - **Input Fields:**
            - **Move-Out Date:** `moveOutDate`.
            - **Agreement End Date:** `agreementEndDate`.
        - **Calculated Output:** `weeksRemaining`, which is derived by finding the difference between `moveOutDate` and `agreementEndDate` in terms of weeks.

**Formula and Calculation:**

1. Multiply `advertisingCost` by `weeksRemaining`:
    
    **`advertisingCost * weeksRemaining = totalAdvertisingCostForRemainingWeeks`**
    
2. Divide the result by `threeQuartersOfTermWeeks`:
    
    **`totalAdvertisingCostForRemainingWeeks / threeQuartersOfTermWeeks = finalAdvertisingFee`**

**Output:**
- **`finalAdvertisingFee`**: The final advertising fee to be paid.

#### Example:

**Inputs**:
- `advertisingCost`: $87.
- `totalWeeksInTerm`: 104 weeks.
- `threeQuartersOfTermWeeks`: 78 weeks (¾ of the term).
- `weeksRemaining`: 12 weeks.

**Step-by-Step Calculation:**

1. **Total advertising cost for remaining weeks**:
    
    **$87 * 12 = $1,044**
    
2. **Final advertising fee**:
    
    **$1,044 ÷ 78 = $13.38**

---

### Reletting Fee Calculator

**Required Fields:**

1. **Base Weekly Rent Input:**
    - **Input Field Name:** `baseWeeklyRent`.
    - Users will input the base weekly rent (exclusive of GST).
    - **Calculated Output:** `weeklyRentWithGST` = `baseWeeklyRent + (baseWeeklyRent * 0.10)`.

2. **Agreed Term Dropdown:**
    - **Options:** 6 Months, 1 Year, 2 Years, 3 Years.
    - **Output:**
        - **`totalWeeksInTerm`**: Total weeks in the selected term.
        - **`threeQuartersOfTermWeeks`**: ¾ of the total weeks calculated for the term.

3. **Weeks Left on Agreement:**
    - **Option 1**: Input field where users can directly enter the number of weeks left on the agreement.
        - **Variable Name:** `weeksRemaining`.
    - **Option 2**: Toggle-enabled date fields:
        - **Input Fields:**
            - **Move-Out Date:** `moveOutDate`.
            - **Agreement End Date:** `agreementEndDate`.
        - **Calculated Output:** `weeksRemaining`, which is derived by finding the difference between `moveOutDate` and `agreementEndDate` in terms of weeks.

**Formula and Calculation:**

1. Calculate the **weekly rent inclusive of GST**:
    
    **`baseWeeklyRent * 0.10 = gstAmount`**
    
    **`baseWeeklyRent + gstAmount = weeklyRentWithGST`**
    
2. Calculate the **maximum reletting fee**:
    
    Multiply `weeklyRentWithGST` by 2 (representing the maximum of 2 weeks' rent):
    
    **`weeklyRentWithGST * 2 = maximumRelettingFee`**
    
3. Multiply the `maximumRelettingFee` by `weeksRemaining`:
    
    **`maximumRelettingFee * weeksRemaining = totalRelettingCostForRemainingWeeks`**
    
4. Divide the `totalRelettingCostForRemainingWeeks` by `threeQuartersOfTermWeeks`:
    
    **`totalRelettingCostForRemainingWeeks / threeQuartersOfTermWeeks = finalRelettingFee`**

**Output:**
- **`finalRelettingFee`**: The final reletting fee to be paid.

#### Example:

**Inputs**:
- `baseWeeklyRent`: $100 (exclusive of GST)
- **Calculation for GST-inclusive rent**: **$100 + ($100 * 0.10) = $110**
- `totalWeeksInTerm`: 52 weeks
- `threeQuartersOfTermWeeks`: 39 weeks (¾ of the term)
- `weeksRemaining`: 12 weeks

**Step-by-Step Calculation:**

1. **Weekly rent with GST**:
    
    **$100 + $10 = $110**
    
2. **Maximum reletting fee**:
    
    **$110 * 2 = $220**
    
3. **Total reletting cost for remaining weeks**:
    
    **$220 * 12 = $2,640**
    
4. **Final reletting fee**:
    
    **$2,640 ÷ 39 = $67.69**

## Technical Stack

### Frontend
- Next.js
- Tailwind CSS
- shadcn/ui components
- Lucide React (icons)
- React Hook Form
- Redux (state management)

### Authentication & Database
- Clerk (user authentication)
- Supabase (user profiles)

### Analytics
- Google Analytics
- Vercel Analytics
- Microsoft Clarity

### Utilities
- date-fns
- dotenv

## Key Components

### 1. Main Calculator Page
- Navigation bar with logo
- About section
- SACAT compliance explanation
- Calculator interface
- Link to official SA.GOV.AU documentation
- Authentication UI (Clerk integration)

### 2. Calculator Forms
Both calculators should include:
- Term selection dropdown
- Cost/rent input fields
- Week calculation toggle (direct input vs date-based)
- Clear result display
- Step-by-step calculation breakdown

## Data Flow
1. User inputs required fields
2. Application calculates using SACAT formulas
3. Results displayed instantly
4. No data persistence required except user profiles

## Compliance
- All calculations must strictly follow SACAT formulas
- GST calculations must be accurate (10%)
- Results should be rounded appropriately
- Clear documentation links must be provided

## Future Considerations
- Mobile responsiveness
- Offline capability
- PDF export of calculations
- Multiple language support

## Page Layout Components

### Navigation Bar (`app/components/navbar.tsx`)
- `NavigationMenu` - Main navigation structure
- `NavigationMenuList` - Container for menu items
- `NavigationMenuItem` - Individual menu items
- `NavigationMenuTrigger` - Dropdown triggers
- `NavigationMenuContent` - Dropdown content
- `NavigationMenuLink` - Navigation links

### Main Layout (`app/layout.tsx`)
- Base layout with Clerk provider
- Custom font implementation (Geist)

## Calculator Interface (`app/page.tsx`)

### Main Container
- `Tabs` - Switch between calculators
  - `TabsList` - Container for tab buttons
  - `TabsTrigger` - Individual tab buttons
  - `TabsContent` - Content for each calculator

### Calculator Forms
Both calculators will use:
- `Form` - Form wrapper
- `FormField` - Field container
- `FormItem` - Individual form items
- `FormLabel` - Field labels
- `FormControl` - Input wrappers
- `FormDescription` - Help text
- `FormMessage` - Validation messages
- `Input` - Text inputs for costs/rent
- `Select` - Term selection dropdown
- `Switch` - Toggle between input methods
- `Button` - Calculate and reset buttons

### Calculator-Specific Components

#### Advertising Fee Calculator (`app/components/advertising-calculator.tsx`)
```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
```

#### Reletting Fee Calculator (`app/components/reletting-calculator.tsx`)
```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
```

### Information Section
- `Accordion` - Expandable sections for:
  - How it works
  - SACAT compliance
  - Examples
- `AccordionItem` - Individual expandable sections
- `AccordionTrigger` - Section headers
- `AccordionContent` - Section content

## File Structure

```
LeaseBreak Calculator/
├── app/
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── advertising-calculator.tsx
│   │   ├── reletting-calculator.tsx
│   │   └── information-section.tsx
│   ├── fonts/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── [shadcn components]
│   ├── components/
│   │   ├── footer.tsx
└── ...
```

## Footer Component (`app/components/footer.tsx`)

```tsx
import { Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

// Footer component with credit to isaxcode.com
const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://isaxcode.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              isaxcode.com
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/yourusername/leasebreak-calculator"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://twitter.com/isaxcode"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/isaxcode"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

### Additional Components to Install for Footer
```bash
# For footer social links
npx shadcn-ui@latest add button
```