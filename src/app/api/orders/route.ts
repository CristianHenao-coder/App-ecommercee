import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// Obtener órdenes del usuario
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const email = request.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const orders = await Order.find({ 
      userEmail: email 
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Crear nueva orden
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      userEmail, 
      items, 
      subtotal, 
      discount, 
      shipping, 
      total, 
      couponCode,
      shippingAddress,
      paymentMethod 
    } = body;

    if (!userEmail || !items || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Verificar stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ 
          error: `Producto ${item.productId} no encontrado` 
        }, { status: 404 });
      }
      if (product.stock && product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Stock insuficiente para ${product.name}` 
        }, { status: 400 });
      }
    }

    // Crear la orden
    const order = new Order({
      userEmail,
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
      subtotal,
      discount: discount || 0,
      shipping: shipping || 15000,
      total,
      couponCode,
      shippingAddress,
      paymentMethod: paymentMethod || "pending",
      status: "pending",
    });

    await order.save();

    // Descontar stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creando orden:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Actualizar estado de orden (admin)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { orderId, status, paymentId, paymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "OrderId requerido" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentId) updateData.paymentId = paymentId;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error actualizando orden:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
