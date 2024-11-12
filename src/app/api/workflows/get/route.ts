import { NextResponse } from 'next/server';
import { $serverReq } from '@/utils/serverRequest';

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let url = `/workflows?page=${page}&pageSize=${pageSize}`;
    if (status) url += `&status=${status}`;
    if (category) url += `&category=${category}`;

    const data = await $serverReq.get(url);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}