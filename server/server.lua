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
        if event.owners[userId] or event.guests[userId] then
            table.insert(userEvents, event)
        end
    end

    -- Send the events back to the client who requested them
    TriggerClientEvent('prp_calendar:receiveEvents', playerId, userEvents)
end)

-- Event to create a new event
RegisterNetEvent('prp_calendar:createEvent', function(eventData)
    print("In createEvent")
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
        owners = {},
        guests = {}
    }
    newEvent.owners[userId] = true
    events[eventId] = newEvent

    TriggerClientEvent('prp_calendar:refreshEvents', playerId)
end)
