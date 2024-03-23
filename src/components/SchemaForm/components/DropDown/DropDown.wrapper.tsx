import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DropDown from './DropDown'

export interface EffectDropDownProps {
  effects: any
  virtual: any
  features: any
  setEffect: any
  getVirtuals: any
}

const fetchDeviceIpAddress = async (deviceName: string) => {
  try {
    const response = await axios.get(
      `http://localhost:8888/api/devices/${deviceName}`
    )
    return response.data.ip_address
  } catch (error) {
    console.error('Error fetching device IP address:', error)
    return null
  }
}

const fetchWLEDEffects = async (ipAddress: string, setWLEDEffects: any) => {
  try {
    const wledEffectsResponse = await axios.get(
      `http://${ipAddress}/json/effects`
    )
    setWLEDEffects(wledEffectsResponse.data || [])
  } catch (error) {
    console.error('Error fetching WLED effects:', error)
    setWLEDEffects([])
  }
}

const EffectDropDown = ({
  effects,
  virtual,
  features,
  setEffect,
  getVirtuals
}: EffectDropDownProps) => {
  const [wledEffects, setWLEDEffects] = useState<string[]>([])
  const [deviceIpAddress, setDeviceIpAddress] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (virtual && virtual.config.icon_name === 'wled' && virtual.is_device) {
        const ipAddress = await fetchDeviceIpAddress(virtual.is_device)
        if (ipAddress) {
          setDeviceIpAddress(ipAddress)
          fetchWLEDEffects(ipAddress, setWLEDEffects)
        }
      }
    }

    fetchData()
  }, [virtual])

  const effectNames =
    effects &&
    Object.keys(effects).map((eid) => ({
      name: effects[eid].name,
      id: effects[eid].id,
      category: effects[eid].category
    }))

  const wledEffectOptions =
    wledEffects &&
    wledEffects.map((effect, index) => ({
      name: effect,
      id: `wled_${index}`,
      category: 'WLED'
    }))

  const allEffectOptions = [
    ...(effectNames || []),
    ...(wledEffectOptions || [])
  ]

  // Check if there are WLED effects to include the 'WLED' group
  const groups = allEffectOptions.reduce((r: any, a: any) => {
    return { ...r, [a.category]: [...(r[a.category] || []), a] }
  }, {})

  // Include 'WLED' group only if there are WLED effects
  if (wledEffects.length > 0) {
    groups.WLED = wledEffectOptions || []
  }

  const onEffectTypeChange = async (e: any) => {
    const selectedEffectId = e.target.value

    if (selectedEffectId.startsWith('wled_')) {
      // Handle WLED effect selection
      const wledEffectIndex = parseInt(selectedEffectId.split('_')[1], 10)
      await setEffect(virtual.id, wledEffectIndex)
    } else {
      // Handle LedFx effect selection
      await setEffect(virtual.id, selectedEffectId)
    }

    getVirtuals()

    if (virtual && virtual.config.icon_name === 'wled' && deviceIpAddress) {
      // Check if the selected effect is from WLED
      if (selectedEffectId.startsWith('wled_')) {
        const postPayload = {
          seg: {
            fx: parseInt(selectedEffectId.split('_')[1], 10)
          }
        }

        try {
          await axios.post(`http://${deviceIpAddress}/json/state`, postPayload)
        } catch (postError) {
          console.error('Error making POST call:', postError)
        }
      }
    }
  }

  return (
    <DropDown
      value={(virtual && virtual.effect && virtual.effect.type) || ''}
      onChange={(e: any) => onEffectTypeChange(e)}
      groups={groups}
      showFilter={features.effectfilter}
      title="Effect Type"
    />
  )
}

export default EffectDropDown
