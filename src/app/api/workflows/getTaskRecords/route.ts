import { NextResponse } from 'next/server';
import { $serverReq } from '@/utils/serverRequest';

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('id 不能为空！');
    const data = await $serverReq.get(`/workflows/tasks-records/${id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}