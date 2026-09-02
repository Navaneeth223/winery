/**
 * Film sequence loader.
 *
 * Frames download in playback order with a small concurrency pool, so
 * `loadedUpTo` is always the contiguous prefix of ready frames — the
 * player can draw `min(target, loadedUpTo)` and never stall or flash.
 */

export interface SequenceState {
  frames: string[]
  images: (HTMLImageElement | null)[]
  /** index of the last contiguously loaded frame (-1 = none yet) */
  loadedUpTo: number
  done: boolean
}

const cache = new Map<string, SequenceState>()

export function preloadSequence(
  id: string,
  frames: string[],
  concurrency = 10,
): SequenceState {
  const existing = cache.get(id)
  if (existing) return existing

  const state: SequenceState = {
    frames,
    images: frames.map(() => null),
    loadedUpTo: -1,
    done: false,
  }
  cache.set(id, state)

  const advance = () => {
    while (
      state.loadedUpTo + 1 < state.images.length &&
      state.images[state.loadedUpTo + 1]
    ) {
      state.loadedUpTo++
    }
    if (state.loadedUpTo + 1 >= state.images.length) state.done = true
  }

  let cursor = 0
  const next = () => {
    if (cursor >= frames.length) return
    const i = cursor++
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      state.images[i] = img
      advance()
      next()
    }
    img.onerror = () => {
      // keep the prefix contiguous: substitute the previous good frame
      state.images[i] = state.images[i - 1] ?? null
      advance()
      next()
    }
    img.src = frames[i]
  }

  for (let k = 0; k < concurrency; k++) next()
  return state
}
