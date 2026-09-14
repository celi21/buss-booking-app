import Booking from "../models/booking.js";

export const checkAndCompleteTrips = async () => {
  try {
    // Find all confirmed bookings
    const bookings = await Booking.find({ status: "confirmed" })
      .populate("bus");

    const now = new Date();
    let completedCount = 0;

    for (const booking of bookings) {
      if (!booking.bus || !booking.from || !booking.bookingDate) continue;

      // Find the departure time for the 'from' city
      const fromLocation = booking.bus.locations.find(
        (loc) => loc.city.toString() === booking.from.toString()
      );

      if (!fromLocation) continue;

      // Check arrival time at destination or final stop
      const toLocation = booking.to
        ? booking.bus.locations.find((loc) => loc.city.toString() === booking.to.toString())
        : null;
      const arrivalLocation = toLocation || booking.bus.locations[booking.bus.locations.length - 1];
      const checkTimeStr = arrivalLocation?.arrivalTime || fromLocation?.departureTime;

      if (!checkTimeStr) continue;

      // Handle formats like "09:45:AM" -> "09:45 AM"
      const formattedTime = checkTimeStr.replace(/:([AP]M)$/i, " $1");
      const bookingDateTime = new Date(`${booking.bookingDate} ${formattedTime}`);

      // Skip if date parsing failed
      if (isNaN(bookingDateTime.getTime())) continue;

      // If scheduled arrival time has passed
      if (bookingDateTime < now) {
        booking.status = "completed";
        await booking.save();
        completedCount++;
      }
    }

    if (completedCount > 0) {
      console.log(`[TripCompletionJob] Automatically completed ${completedCount} bookings silently.`);
    }
  } catch (error) {
    console.error("[TripCompletionJob] Error running trip completion job:", error);
  }
};
