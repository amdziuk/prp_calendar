-- In a full implementation, we must use some cloud-hosted database (eg. Postgres)
-- for storing events so that they're properly persisted. For the purposes of this
-- demo, I am just using a table to store events
local events = {}

-- License identifier constant
local IDENTIFIER_LICENSE <const> = 0

-- In a full implementation, I would suggest the use of a UUID/GUID instead, but
-- using a stringified int for this demo
local function generateEventId()
    return tostring(math.random(1000000, 9999999))
end

-- NetEvent to get events for a user
RegisterNetEvent('prp_calendar:getEvents', function()
    local userId = GetPlayerIdentifier(source, IDENTIFIER_LICENSE)

    -- Filter events where the user is an owner or guest
    local userEvents = {}
    for _, event in pairs(events) do
        if table.contains(event.owners, userId) or table.contains(event.guests, userId) then
            table.insert(userEvents, event)
        end
    end

    -- Send the events back to the client who requested them
    TriggerClientEvent('prp_calendar:receiveEvents', source, userEvents)
end)

-- NetEvent to create an event with calling player as owner
RegisterNetEvent('prp_calendar:createEvent', function(eventData)
    local userId = GetPlayerIdentifier(source, IDENTIFIER_LICENSE)
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

    -- Instruct the client to refresh events
    TriggerClientEvent('prp_calendar:refreshEvents', source)
end)

-- NetEvent to create an event with calling player as owner
RegisterNetEvent('prp_calendar:editEvent', function(eventData)
    -- Example of validations I typically put into place
    if not eventData or not eventData.id then
        TriggerClientEvent(
            'prp_calendar:eventEdited',
            source,
            { success = false, error = 'Missing event data' }
        )
    end

    local userId = GetPlayerIdentifier(source, IDENTIFIER_LICENSE)
    local eventId = eventData.id
    local event = events[eventId]

    -- This includes a pseudo-auth check which we'd probably expand upon in a proper implementation for PRP
    if event and table.contains(event.owners, userId) then
        event.title = eventData.title
        event.description = eventData.description
        event.location = eventData.location
        event.start_time = eventData.start_time
        event.end_time = eventData.end_time
        events[eventId] = event
        TriggerClientEvent(
            'prp_calendar:eventEdited',
            source,
            { success = true, eventId = eventId }
        )
    else
        TriggerClientEvent(
            'prp_calendar:eventEdited',
            source,
            { success = false, error = 'You do not have permission to edit this event' }
        )
    end
end)

-- NetEvent to delete an event
RegisterNetEvent('prp_calendar:deleteEvent', function(eventId)
    local userId = GetPlayerIdentifier(source, IDENTIFIER_LICENSE)

    local event = events[eventId]
    if event and table.contains(event.owners, userId) then
        events[eventId] = nil
        TriggerClientEvent('prp_calendar:eventDeleted', source, { success = true, eventId = eventId })
    else
        TriggerClientEvent('prp_calendar:eventDeleted', source, { success = false, error = 'You do not have permission to delete this event.' })
    end
end)

-- Helper function for server to print server logs of currently persisted events
RegisterNetEvent('prp_calendar:printEvents', function()
    for _, event in pairs(events) do
        PrintEvent(event)
    end
end)

-- Helper function for printing an event
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

-- Helper function for checking if a table contains an element
function table.contains(table, element)
    for _, value in pairs(table) do
        if value == element then
            return true
        end
    end
    return false
end
