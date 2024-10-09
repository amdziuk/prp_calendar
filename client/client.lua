local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('calendar', function()
  toggleNuiFrame(true)
  debugPrint('Show NUI frame')
end, false)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getEvents', function(data, cb)
  print('[Calendar] NUI Callback: getEvents')
  TriggerServerEvent('prp_calendar:getEvents')
  cb('ok')
end)

RegisterNUICallback('createEvent', function(data, cb)
  print('[Calendar] NUI Callback: createEvent', data)
  TriggerServerEvent('prp_calendar:createEvent', data)
  cb('ok')
end)

RegisterNetEvent('prp_calendar:receiveEvents', function(events)
  print('[Calendar] Received events from server')
  SendNUIMessage({ action = 'receiveEvents', events = events })
end)

-- RegisterNetEvent('prp_calendar:eventCreated', function(response)
--   print('[Calendar] Event created', response.event)
--   SendNUIMessage({ action = 'eventCreated', event = response.event })
-- end)

RegisterNetEvent('prp_calendar:refreshEvents', function()
  print('[Calendar] Refresh Events')
  SendNUIMessage({
      action = 'fetchEvents'
  })
end)
