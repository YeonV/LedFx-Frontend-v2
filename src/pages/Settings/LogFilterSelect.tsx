import React, { useState, useEffect } from 'react'
import {
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  SelectChangeEvent // Import correct type for event
} from '@mui/material'

// Import functions and colors from your helper file
import {
  setEnabledLogColors,
  availableColorNames, // Import the exported color names
  ColorName,
  log
} from '../../utils/log' // Adjust import path as needed

// Optional: Define MenuProps for styling the dropdown
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const LogColorFilterSelect: React.FC = () => {
  // State to hold the currently selected colors in the UI
  const [selectedColors, setSelectedColors] = useState<string[]>(() => {
    try {
      const storedColors = localStorage.getItem('logViewerEnabledColors')
      if (storedColors) {
        const parsedColors = JSON.parse(storedColors)
        if (
          Array.isArray(parsedColors) &&
          parsedColors.every((c) => availableColorNames.includes(c))
        ) {
          log.purple('Settings', 'Loaded colors from localStorage:', parsedColors) // Good place for debug log
          return parsedColors // Use stored value
        }
        log.warn('Settings', 'Invalid color data in localStorage, using default.')
      }
    } catch (e) {
      console.error('Failed to parse log color filter from localStorage', e)
    }

    // --- MODIFIED FALLBACK ---
    // If localStorage is empty or invalid, default to all available colors *except* 'purple'
    log.debug('Settings', 'No valid localStorage colors, initializing default filter (no purple).')
    const defaultSelection = availableColorNames.filter((color) => color !== 'purple')
    return defaultSelection
    // --- END MODIFICATION ---
  })

  // Effect to update the actual logger filter when local state changes
  useEffect(() => {
    // Assert that selectedColors is an array of strings, then cast to ColorName[]
    setEnabledLogColors(selectedColors as ColorName[]) // Update the actual filter
    // Persist selection to localStorage
    try {
      localStorage.setItem('logViewerEnabledColors', JSON.stringify(selectedColors))
    } catch (e) {
      console.error('Failed to save log color filter to localStorage', e)
    }
  }, [selectedColors]) // Run only when selectedColors changes

  const handleChange = (event: SelectChangeEvent<typeof selectedColors>) => {
    const {
      target: { value }
    } = event
    // On autofill we get a stringified value.
    const newSelection = typeof value === 'string' ? value.split(',') : value
    setSelectedColors(newSelection)
  }

  return (
    <Select
      variant="standard"
      disableUnderline
      id="log-color-filter-select"
      multiple
      value={selectedColors}
      onChange={handleChange}
      renderValue={(selected) => {
        // Type assertion to ensure 'selected' is treated as string[]
        const selectedArray = selected as string[]
        if (selectedArray.length === 0) {
          return <em>Select Colors...</em> // Placeholder text
        }
        if (selectedArray.length === availableColorNames.length) {
          return 'All Colors Enabled'
        }
        return `${selectedArray.length} Color(s) Enabled` // Show count
      }}
      MenuProps={MenuProps}
    >
      {availableColorNames.map((colorName) => (
        <MenuItem key={colorName} value={colorName}>
          {/* Add Checkbox for visual selection indication */}
          <Checkbox checked={selectedColors.indexOf(colorName) > -1} size="small" />
          <ListItemText primary={colorName} />
          {/* Optional: Add a color swatch */}
          {/* <Box sx={{ width: 16, height: 16, bgcolor: colorStyles[colorName] || '#ccc', ml: 1, border: '1px solid grey' }} /> */}
        </MenuItem>
      ))}
    </Select>
  )
}

export default LogColorFilterSelect
