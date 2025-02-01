import dbConnect from "@/lib/dbConnect";
import Events from "@/models/events";

// GET: Fetch all events
export async function GET(req, res) {
  await dbConnect();

  try {
    const events = await Events.find({});
    return new Response(JSON.stringify(events), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
      }
    );
  }
}

// POST: Create a new event
export async function POST(req, res) {
  await dbConnect();

  try {
    const body = await req.json(); // Parse the request body
    const event = await Events.create(body);
    return new Response(JSON.stringify(event), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
      }
    );
  }
}

// PUT: Update an existing event by ID
export async function PUT(req, res) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id"); // Extract the ID from the query params

  try {
    const body = await req.json();
    const updatedEvent = await Events.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return new Response(
        JSON.stringify({ success: false, message: "Event not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: updatedEvent }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
      }
    );
  }
}

// DELETE: Delete an event by ID
export async function DELETE(req, res) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id"); // /api/events?id=123SOMEID

  try {
    const deletedEvent = await Events.findByIdAndDelete(id);

    if (!deletedEvent) {
      return new Response(
        JSON.stringify({ success: false, message: "Event not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Event deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
      }
    );
  }
}

// Fallback: Handle unsupported HTTP methods
export async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return GET(req, res);
    case "POST":
      return POST(req, res);
    case "PUT":
      return PUT(req, res);
    case "DELETE":
      return DELETE(req, res);
    default:
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        {
          status: 405,
        }
      );
  }
}
