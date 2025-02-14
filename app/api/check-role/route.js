import { auth } from '@clerk/nextjs';
import { checkRole } from '@/utils/roles';

export async function GET() {
    const isAdmin = await checkRole('booking_admin')
    return new Response(
        JSON.stringify({ isAdmin }),
        { status: 200 }
      );
}