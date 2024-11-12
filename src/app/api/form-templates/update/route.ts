import { NextResponse } from 'next/server';
import { $serverReq } from '@/utils/serverRequest';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id 不能为空' }, { status: 400 });
    }
    const data = await $serverReq.put(`/form-templates/${id}`, body);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}