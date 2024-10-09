-- Table to store all events
local events = {}

local function generateEventId()
    return tostring(math.random(1000000, 9999999))
end

-- Event to get events for a user
RegisterNetEvent('prp_calendar:getEvents', function()
    local playerId = source
    local identifiers = GetPlayerIdentifiers(playerId)
    local userId = identifiers[1]

    -- Filter events where the user is an owner or guest
    local userEvents = {}
    for _, event in pairs(events) do
        if table.contains(event.owners, userId) or table.contains(event.guests, userId) then
            table.insert(userEvents, event)
        end
    end

    -- Send the events back to the client who requested them
    TriggerClientEvent('prp_calendar:receiveEvents', playerId, userEvents)
end)

RegisterNetEvent('prp_calendar:createEvent', function(eventData)
    local playerId = source
    local identifiers = GetPlayerIdentifiers(playerId)
    local userId = identifiers[1]

    local eventId = generateEventId()
    local newEvent = {
        id = eventId,
        title = eventData.title,
        description = eventData.description,
        location = eventData.location,
        start_time = eventData.start_time,
        end_time = eventData.end_time,
        owners = {userId},
        guests = {}
    }
    events[eventId] = newEvent

    TriggerClientEvent('prp_calendar:refreshEvents', playerId)
end)

RegisterNetEvent('prp_calendar:deleteEvent', function(eventId)
    print("In: prp_calendar:deleteEvent")
    print("EventId: " .. eventId)
    local playerId = source
    local identifiers = GetPlayerIdentifiers(playerId)
    local userId = identifiers[1]

    local event = events[eventId]
    if event and table.contains(event.owners, userId) then
        events[eventId] = nil
        TriggerClientEvent('prp_calendar:eventDeleted', playerId, { success = true, eventId = eventId })
    else
        TriggerClientEvent('prp_calendar:eventDeleted', playerId, { success = false, error = 'You do not have permission to delete this event.' })
    end
end)

RegisterNetEvent('prp_calendar:printEvents', function()
    print("printEvents start")
    for _, event in pairs(events) do
        PrintEvent(event)
    end
    print("printEvents end")
end)

function PrintEvent(event)
    print("Event ID: " .. event.id)
    print("Title: " .. event.title)
    print("Description: " .. event.description)
    print("Location: " .. event.location)
    print("Start Time: " .. event.start_time)
    print("End Time: " .. event.end_time)
    print("Owners: " .. table.concat(event.owners, ", "))
    print("Guests: " .. table.concat(event.guests, ", "))
end

function table.contains(table, element)
    for _, value in pairs(table) do
        if value == element then
            return true
        end
    end
    return false
end
