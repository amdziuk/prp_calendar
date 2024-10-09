-- Helper function for toggling the NUI frame
local function toggleNuiFrame(shouldShow)
    SetNuiFocus(shouldShow, shouldShow)
    SendReactMessage('setVisible', shouldShow)
end

-- COMMANDS
-- calendar brings up the NUI calendar
RegisterCommand('calendar', function()
    toggleNuiFrame(true)
end, false)

-- print_events tells the server to print persisted events
RegisterCommand('print_events', function()
    TriggerServerEvent('prp_calendar:printEvents')
end, false)

-- NUI CALLBACKS
-- hideFrame hides the NUI frame
RegisterNUICallback('hideFrame', function(_, cb)
    toggleNuiFrame(false)
    cb({})
end)

-- getEvents is used to get events from server
RegisterNUICallback('getEvents', function(_, cb)
    TriggerServerEvent('prp_calendar:getEvents')
    cb('ok')
end)

-- createEvent is used for creating an event
RegisterNUICallback('createEvent', function(data, cb)
    TriggerServerEvent('prp_calendar:createEvent', data)
    cb('ok')
end)

-- editEvent is used for editing an event
RegisterNUICallback('editEvent', function(data, cb)
    TriggerServerEvent('prp_calendar:editEvent', data)
    cb('ok')
end)

-- deleteEvent is used for deleting an event
RegisterNUICallback('deleteEvent', function(data, cb)
    local eventId = data.eventId
    TriggerServerEvent('prp_calendar:deleteEvent', eventId)
    cb('ok')
end)

-- NET EVENTS
-- receiveEvents sends server-provided events to NUI
RegisterNetEvent('prp_calendar:receiveEvents', function(events)
    SendNUIMessage({
        action = 'receiveEvents',
        events = events
    })
end)

-- refreshEvents instructs the NUI frame to re-fetch events
RegisterNetEvent('prp_calendar:refreshEvents', function()
    SendNUIMessage({
        action = 'fetchEvents'
    })
end)

-- eventDeleted instructs the NUI frame about the result of event deletion
RegisterNetEvent('prp_calendar:eventDeleted', function(response)
    if response.success then
        SendNUIMessage({
            action = 'fetchEvents'
        })
    else
        print("eventDeleted received error: " .. response.error)
    end
end)

-- eventEdited instructs the NUI frame about the result of event edit
RegisterNetEvent('prp_calendar:eventEdited', function(response)
    if response.success then
        SendNUIMessage({
            action = 'fetchEvents'
        })
    else
        print("eventEdited received error: " .. response.error)
    end
end)
