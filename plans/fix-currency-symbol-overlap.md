# Fix Currency Symbol Overlap in Number Inputs

## Problem Statement

In the Aires Financial Model, input text boxes that display currency symbols (like `$`) inside the input field are experiencing overlap issues where the initial digits overlap with the symbol, making them difficult to read.

**Current Implementation Issues:**
- The `NumberInput` component displays prefix/suffix symbols INSIDE the input field using absolute positioning
- When users type numbers, they overlap with the symbol
- This affects user experience and readability

**Affected Areas:**
- Revenue page: Thermal Circuit combo discounts
- Costs page: Multiple currency inputs (rent, salaries, overhead, labor costs)
- 11 instances total using `prefix="$"` throughout the application

## Current Architecture

### NumberInput Component Structure

The [`NumberInput`](src/components/ui/NumberInput.tsx:18) component has two display modes:

1. **Compact Mode** (Lines 39-54)
   - ✅ Already displays prefix/suffix OUTSIDE the input
   - Uses flexbox layout with prefix and suffix as siblings
   - Works correctly without overlap

2. **Non-Compact Mode** (Lines 57-82)
   - ❌ Displays prefix/suffix INSIDE the input field
   - Uses absolute positioning for prefix/suffix
   - Adds padding to input (`pl-7`, `pr-12`)
   - **This is where the overlap occurs**

### Current Non-Compact Implementation

```tsx
<div className="relative">
  {prefix && (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
      {prefix}
    </span>
  )}
  <input
    type="number"
    className={`${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
  />
  {suffix && (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
      {suffix}
    </span>
  )}
</div>
```

## Proposed Solution

### Design Approach

Move the prefix and suffix OUTSIDE the input field for the non-compact mode, similar to how compact mode already works. This will:

1. **Eliminate overlap** - Symbols sit outside the input boundaries
2. **Improve readability** - Clear separation between symbol and value
3. **Maintain consistency** - Both modes use the same approach
4. **Preserve functionality** - No changes to component API

### New Non-Compact Layout

```tsx
<div className="flex items-center gap-2">
  {prefix && (
    <span className="text-sm font-medium text-gray-600">
      {prefix}
    </span>
  )}
  <input type="number" className="flex-1" />
  {suffix && (
    <span className="text-sm font-medium text-gray-600">
      {suffix}
    </span>
  )}
</div>
```

### Visual Comparison

**Before (Inside Input):**
```
┌─────────────────────────┐
│ $ [12345 overlapping]   │
└─────────────────────────┘
```

**After (Outside Input):**
```
     ┌──────────────────┐
  $  │ 12345            │  %
     └──────────────────┘
```

## Implementation Plan

### 1. Update NumberInput Component

**File:** [`src/components/ui/NumberInput.tsx`](src/components/ui/NumberInput.tsx:1)

**Changes:**
- Modify the non-compact mode layout (lines 57-82)
- Change from absolute positioning to flexbox layout
- Adjust styling for external prefix/suffix display
- Remove padding classes from input (no longer needed)
- Update prefix/suffix text styling for consistency

**Key modifications:**
```tsx
// Non-compact mode - NEW implementation
return (
  <div className={`input-group ${className}`}>
    {label && <label>{label}</label>}
    <div className="flex items-center gap-2">
      {prefix && (
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      {suffix && (
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
          {suffix}
        </span>
      )}
    </div>
  </div>
)
```

### 2. CSS Adjustments

**File:** [`src/app/globals.css`](src/app/globals.css:1)

**Potential updates:**
- May need to adjust `.input-group` styles if needed
- Ensure proper alignment with flexbox
- No major CSS changes expected (existing styles should work)

### 3. Testing Requirements

Test all affected components:

#### Revenue Page Tests
- [ ] Thermal Circuit - Hotel Combo Discount input
- [ ] Thermal Circuit - Non-Hotel Combo Discount input
- [ ] Verify alignment with other inputs
- [ ] Check responsive behavior on mobile

#### Costs Page Tests
- [ ] Fixed Costs - Annual Base Rent
- [ ] Fixed Costs - Annual Management Salary
- [ ] Fixed Costs - Weekly Overhead
- [ ] Variable Costs - Back Bar / Treatment
- [ ] Variable Costs - Amenity / Guest
- [ ] Variable Costs - Treatment Labor
- [ ] Labor Costs - Attendants Hourly Rate (compact mode)
- [ ] Labor Costs - Receptionists Hourly Rate (compact mode)
- [ ] Labor Costs - Supervisors Hourly Rate (compact mode)

#### Functional Tests
- [ ] Numbers display clearly without overlap
- [ ] Prefix/suffix aligned properly
- [ ] Input width adjusts appropriately
- [ ] Form layout maintains proper spacing
- [ ] Both compact and non-compact modes work correctly

## Benefits

1. **Improved UX** - Clear, readable input values
2. **Consistency** - Both input modes use the same approach
3. **Maintainability** - Simpler layout without absolute positioning
4. **Accessibility** - Better visual separation for users
5. **No Breaking Changes** - Component API remains the same

## Affected Files

- [`src/components/ui/NumberInput.tsx`](src/components/ui/NumberInput.tsx:1) - Main component changes
- [`src/app/(app)/revenue/page.tsx`](src/app/(app)/revenue/page.tsx:1) - Uses 2 instances with `prefix="$"`
- [`src/app/(app)/costs/page.tsx`](src/app/(app)/costs/page.tsx:1) - Uses 9 instances with `prefix="$"`
- [`src/app/globals.css`](src/app/globals.css:1) - Potential minor style adjustments

## Risk Assessment

**Low Risk:**
- Simple layout change
- No API modifications
- Existing compact mode proves the approach works
- Easy to test visually

## Next Steps

Once approved, switch to **Code mode** to implement the changes following this plan.
