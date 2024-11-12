import { NextResponse } from 'next/server';
import { $serverReq } from '@/utils/serverRequest';

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if(!id) {
      return NextResponse.json({ error: 'id不能为空' }, { status: 400 });
    }
    const data = await $serverReq.get(`/form-templates/${id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}