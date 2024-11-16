// app/api/items/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongoose';
import mongoose from 'mongoose';

// Define the Item schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ndc: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
});

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

// GET function to fetch all items
export async function GET() {
  await connectToDatabase();
  try {
    const items = await Item.aggregate([
      {
        $group: {
          _id: { name: "$name", ndc: "$ndc" },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          ndc: "$_id.ndc",
          quantity: "$totalQuantity"
        }
      }
    ]);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST function to create a new item
export async function POST(req) {
  await connectToDatabase();
  try {
    const { name, ndc, quantity } = await req.json();
    const item = await Item.create({ name, ndc, quantity });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT function to update an existing item
export async function PUT(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url); // Extract searchParams from URL
    const ndc = searchParams.get('ndc');
    console.log(`Attempting to update item with ndc: ${ndc}`); // Debugging line
    const { name, quantity } = await req.json();

    // Find the item by NDC and update its name and quantity
    const existingItem = await Item.findOne({ ndc });
    if (!existingItem) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    existingItem.name = name;
    existingItem.quantity = quantity;
    await existingItem.save();

    return NextResponse.json({ success: true, data: existingItem });
  } catch (error) {
    console.error(`Error during PUT:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


// DELETE function to delete an existing item
export async function DELETE(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url); 
    const ndc = searchParams.get('ndc'); 
    console.log(`Deleting item with ndc: ${ndc}`); //Debugging line
    const item = await Item.findOneAndDelete({ ndc });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(`Error during DELETE:`,error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
