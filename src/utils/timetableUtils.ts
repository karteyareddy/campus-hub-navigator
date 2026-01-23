export interface TimetableEntry {
    section: string;
    day: string;
    period: number;
    time: string;
    subject: string;
    faculty: string; // Name or Code
    roomRaw: string;
    roomDecoded: {
        block: string;
        floor: string;
        roomNo: string;
    } | null;
    type: string;
}

export const parseCSV = (csvText: string, sectionName: string): TimetableEntry[] => {
    const lines = csvText.split('\n');
    const entries: TimetableEntry[] = [];

    // Skip header (row 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV split (assuming no commas in fields for now)
        const cols = line.split(',');
        if (cols.length < 8) continue;

        // Col mapping based on: Section,Day,Period,Time,Subject,Faculty,Room,Class_Type
        const section = cols[0].trim();
        const day = cols[1].trim();
        const period = parseInt(cols[2].trim());
        const time = cols[3].trim();
        const subject = cols[4].trim();
        const faculty = cols[5].trim();
        const room = cols[6].trim();
        const type = cols[7].trim();

        // Ignore rows with "FREE" or "LUNCH" if they are main subject, 
        // BUT user wants to know who is free. 
        // If subject is "FREE", faculty is usually "-" or empty.
        // We store everything, filter later.

        entries.push({
            section,
            day,
            period,
            time,
            subject,
            faculty,
            roomRaw: room,
            roomDecoded: decodeRoom(room),
            type
        });
    }
    return entries;
};

// Logic: 8609 -> 8th block, 6th floor, class 09
export const decodeRoom = (roomCode: string) => {
    if (!roomCode || roomCode === '-' || roomCode.toLowerCase() === 'nan') return null;

    // Assuming 4 digits: B F RR
    // Example: 8609
    if (roomCode.length === 4) {
        return {
            block: roomCode[0],
            floor: roomCode[1],
            roomNo: roomCode.slice(2)
        };
    }

    // Fallback or complex logic for other lengths if strictly defined?
    // User specific example was 4 digits.
    return null;
};

export const getAllUniqueFaculties = (entries: TimetableEntry[]): string[] => {
    const set = new Set<string>();
    entries.forEach(e => {
        if (e.faculty && e.faculty !== '-' && e.faculty.toUpperCase() !== 'NULL') {
            set.add(e.faculty);
        }
    });
    return Array.from(set).sort();
};

export const getAllUniqueRooms = (entries: TimetableEntry[]): string[] => {
    const set = new Set<string>();
    entries.forEach(e => {
        if (e.roomRaw && e.roomRaw !== '-' && e.roomRaw.toUpperCase() !== 'NULL') {
            set.add(e.roomRaw);
        }
    });
    return Array.from(set).sort();
};

export const getOccupiedFaculties = (entries: TimetableEntry[], day: string, time: string): string[] => {
    return entries
        .filter(e => e.day.toLowerCase() === day.toLowerCase() && e.time === time && e.faculty && e.faculty !== '-')
        .map(e => e.faculty);
};

export const getOccupiedRooms = (entries: TimetableEntry[], day: string, time: string): string[] => {
    return entries
        .filter(e => e.day.toLowerCase() === day.toLowerCase() && e.time === time && e.roomRaw && e.roomRaw !== '-')
        .map(e => e.roomRaw);
};
