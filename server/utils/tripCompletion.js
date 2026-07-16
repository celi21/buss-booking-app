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

      if (!fromLocation || !fromLocation.departureTime) continue;

      const bookingDate = booking.bookingDate;
      const departureTime = fromLocation.departureTime;
      const bookingDateTime = new Date(`${bookingDate} ${departureTime}`);

      // Skip if date parsing failed
      if (isNaN(bookingDateTime.getTime())) continue;

      // If scheduled trip time has passed
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
