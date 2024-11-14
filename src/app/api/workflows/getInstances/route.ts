import { NextResponse } from 'next/server';
import { $serverReq } from '@/utils/serverRequest';

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 构建基础查询参数
    const queryParams = new URLSearchParams({
      page: searchParams.get('page') || '1',
      page_size: searchParams.get('page_size') || '10'
    });

    // 可选参数列表
    const optionalParams: Record<string, string | null> = {
      category: searchParams.get('category'),
      status: searchParams.get('status')
    };

    // 只添加有效的参数
    Object.entries(optionalParams).forEach(([key, value]) => {
      if (value !== null && 
          value !== undefined && 
          value !== 'undefined' && 
          value !== 'null' &&
          value.trim() !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `/workflows/instances?${queryParams.toString()}`;
    
    const data = await $serverReq.get(url);
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}