export type ItemRecord = Record<string, unknown> & {
  id?: number | string
}

export type ItemsResponse = {
  items: ItemRecord[]
}

const DATA_URL = "https://revium-test.vercel.app/api/data"

type FetchItemsOptions = {
  signal?: AbortSignal
}

export async function fetchItems(options: FetchItemsOptions = {}): Promise<ItemRecord[]> {
  const response = await fetch(DATA_URL, { signal: options.signal })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  const data = (await response.json()) as ItemsResponse
  return data.items
}
