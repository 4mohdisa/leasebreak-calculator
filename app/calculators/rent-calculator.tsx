"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { updateRentCalculator } from "@/lib/redux/calculatorSlice"
import { event as gaEvent } from '@/lib/gtag'
import React from "react"

export function RentCalculator() {
  const dispatch = useDispatch()
  const {
    weeklyRent,
    calculatedAdvance,
    calculatedBond,
    calculatedTotal,
    error
  } = useSelector((state: RootState) => state.calculator.rentCalculator)

  const handleCalculate = () => {
    // Reset any previous errors
    dispatch(updateRentCalculator({ error: null }))

    // Validate weekly rent
    const rent = parseFloat(weeklyRent)
    if (isNaN(rent) || rent <= 0) {
      dispatch(updateRentCalculator({ 
        error: "Please enter a valid weekly rent amount",
        calculatedAdvance: null,
        calculatedBond: null,
        calculatedTotal: null
      }))
      return
    }

    // Calculate two weeks advance
    const advance = rent * 2

    // Calculate bond amount
    const bond = rent <= 800 ? rent * 4 : rent * 6

    // Calculate total
    const total = advance + bond

    // Track the calculation event
    gaEvent({
      action: 'rent_calculation',
      category: 'Calculator',
      label: `Weekly Rent: ${rent}`,
      value: Math.round(total * 100) / 100
    })

    // Update state with calculations
    dispatch(updateRentCalculator({ 
      calculatedAdvance: Math.round(advance * 100) / 100,
      calculatedBond: Math.round(bond * 100) / 100,
      calculatedTotal: Math.round(total * 100) / 100,
      error: null 
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Calculator</CardTitle>
        <CardDescription>
          Calculate your move-in costs including bond and rent in advance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Weekly Rent Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter weekly rent"
                value={weeklyRent}
                onChange={(e) => dispatch(updateRentCalculator({ weeklyRent: e.target.value }))}
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            {calculatedAdvance !== null && calculatedBond !== null && calculatedTotal !== null && (
              <div className="rounded-md bg-muted p-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Two Weeks Advance:</span> ${calculatedAdvance}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Bond Amount:</span> ${calculatedBond}
                </div>
                <div className="text-sm font-semibold">
                  <span>Total Move-in Cost:</span> ${calculatedTotal}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Calculate Costs
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
