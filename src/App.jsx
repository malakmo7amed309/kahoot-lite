import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uijyoxkppndiyboguhzm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ntTZHgBcoK8a5_EQwVepIQ_60e9yDPg'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const Q_TIME = 15 // seconds per question

const PACKS = [
  {
    id: 'general',
    name: 'General Knowledge',
    icon: 'globe',
    questions: [
      { q: 'Which planet is known as the Red Planet?', a: ['Mars', 'Venus', 'Jupiter', 'Mercury'], c: 0 },
      { q: 'How many sides does a hexagon have?', a: ['Five', 'Six', 'Seven', 'Eight'], c: 1 },
      { q: 'What is the largest ocean on Earth?', a: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], c: 2 },
      { q: 'Which language has the most native speakers?', a: ['English', 'Hindi', 'Spanish', 'Mandarin Chinese'], c: 3 },
      { q: 'What year did the first iPhone launch?', a: ['2005', '2007', '2009', '2010'], c: 1 },
      { q: 'Which animal is the tallest in the world?', a: ['Elephant', 'Giraffe', 'Ostrich', 'Moose'], c: 1 },
      { q: 'How many minutes are in three hours?', a: ['160', '180', '200', '240'], c: 1 },
      { q: 'What is the capital of Australia?', a: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], c: 2 },
    ],
  },
  {
    id: 'egypt',
    name: 'All About Egypt',
    icon: 'camel',
    questions: [
      { q: 'The Nile flows into which sea?', a: ['Red Sea', 'Mediterranean Sea', 'Black Sea', 'Arabian Sea'], c: 1 },
      { q: 'Which city is home to the Great Pyramids?', a: ['Luxor', 'Alexandria', 'Giza', 'Aswan'], c: 2 },
      { q: 'What is the currency of Egypt?', a: ['Dinar', 'Pound', 'Riyal', 'Dirham'], c: 1 },
      { q: 'The Suez Canal connects the Mediterranean to which body of water?', a: ['Red Sea', 'Nile Delta', 'Persian Gulf', 'Lake Nasser'], c: 0 },
      { q: 'Which ancient queen ruled Egypt and allied with Rome?', a: ['Nefertiti', 'Hatshepsut', 'Cleopatra', 'Merneith'], c: 2 },
      { q: 'Koshary is Egypt’s beloved national…', a: ['Dance', 'Dish', 'Instrument', 'Festival'], c: 1 },
      { q: 'The Great Sphinx has the body of which animal?', a: ['Falcon', 'Lion', 'Jackal', 'Bull'], c: 1 },
      { q: 'Which library made ancient Alexandria famous?', a: ['Library of Pergamum', 'House of Wisdom', 'Great Library', 'Library of Nineveh'], c: 2 },
    ],
  },
  {
    id: 'webdev',
    name: 'Web Dev Trivia',
    icon: 'laptop',
    questions: [
      { q: 'What does CSS stand for?', a: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Sheets'], c: 1 },
      { q: 'Which hook runs after every render by default?', a: ['useState', 'useMemo', 'useEffect', 'useRef'], c: 2 },
      { q: 'Which HTML tag creates a hyperlink?', a: ['<link>', '<a>', '<href>', '<url>'], c: 1 },
      { q: 'What does JSON stand for?', a: ['JavaScript Object Notation', 'Java Standard Output Network', 'JavaScript Online Notation', 'Java Source Open Network'], c: 0 },
      { q: 'Which company created React?', a: ['Google', 'Microsoft', 'Meta', 'Vercel'], c: 2 },
      { q: 'Which of these is NOT a JavaScript framework?', a: ['Vue', 'Svelte', 'Laravel', 'Angular'], c: 2 },
      { q: 'What does API stand for?', a: ['Applied Program Internet', 'Application Programming Interface', 'Automated Protocol Interchange', 'Application Process Integration'], c: 1 },
      { q: 'In Git, what command saves staged changes?', a: ['git push', 'git save', 'git commit', 'git stash'], c: 2 },
    ],
  },
]

const SHAPES = ['▲', '◆', '●', '■']
const ANSWER_STYLES = [
  'bg-[#e21b3c] shadow-[0_6px_0_#a01230]',
  'bg-[#1368ce] shadow-[0_6px_0_#0b4a94]',
  'bg-[#d89e00] shadow-[0_6px_0_#9c7100]',
  'bg-[#26890c] shadow-[0_6px_0_#1b6408]',
]

const makeCode = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const fmt = (n) => n.toLocaleString('en-US')

// ---------- shared bits ----------

function Grain({ children }) {
  return (
    <div className="min-h-full bg-gradient-to-b from-grape to-grape-deep text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6">{children}</div>
    </div>
  )
}

function Logo() {
  return (
    <div className="text-center font-display text-3xl font-semibold tracking-wide">
      kahoot<span className="text-[#ffcf00]">·</span>lite
    </div>
  )
}

function Countdown({ endsAt }) {
  const [, force] = useState(0)
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 200)
    return () => clearInterval(t)
  }, [])
  const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
  return (
    <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-white font-display text-2xl font-semibold text-grape ${left <= 5 ? 'anim-ring' : ''}`}>
      {left}
    </div>
  )
}


function Icon({ name, size = 24 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const medal = (fill) => <svg {...c} stroke="none"><path d="M7 2h4l1 6H8zM17 2h-4l-1 6h4z" fill="#e21b3c" /><circle cx="12" cy="15" r="6.500" fill={fill} /><circle cx="12" cy="15" r="4" fill="none" stroke="#0004" strokeWidth="1" /></svg>
  switch (name) {
    case 'gold': return medal('#ffcf00')
    case 'silver': return medal('#cfd6e0')
    case 'bronze': return medal('#d08a4c')
    case 'crown': return <svg {...c} fill="#ffcf00" stroke="#a87b00"><path d="M3 18l-1-11 5 4 5-8 5 8 5-4-1 11z" /></svg>
    case 'flag': return <svg {...c}><path d="M5 22V3M5 4h13l-3 4 3 4H5" /></svg>
    case 'flame': return <svg {...c} fill="#ff8a00" stroke="none"><path d="M12 2s5 4.500 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" /></svg>
    case 'party': return <svg {...c}><path d="M3 21l5-14 9 9z" fill="#ffcf0055" /><path d="M14 4l1-2M18 8l2-1M20 12l2 .5M11 3l.5 1.500" /></svg>
    case 'mic': return <svg {...c}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v4" /></svg>
    case 'phone': return <svg {...c}><rect x="7" y="2" width="10" height="20" rx="2.500" /><path d="M11 18h2" /></svg>
    case 'bolt': return <svg {...c} fill="#ffcf00" stroke="none"><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>
    case 'trophy': return <svg {...c}><path d="M7 3h10v6a5 5 0 01-10 0zM7 5H3c0 4 2 5 4 5M17 5h4c0 4-2 5-4 5M12 14v4M8 21h8" /></svg>
    case 'globe': return <svg {...c}><circle cx="12" cy="12" r="9.500" /><ellipse cx="12" cy="12" rx="4" ry="9.500" /><path d="M2.500 12h19" /></svg>
    case 'camel': return <svg {...c}><path d="M2 20L12 4l10 16zM12 4v16M7 12h10M4.500 16h15" /></svg>
    case 'laptop': return <svg {...c}><rect x="4" y="5" width="16" height="11" rx="1.500" /><path d="M2 20h20" /></svg>
    default: return null
  }
}

function Podium({ players }) {
  const top = players.slice(0, 3)
  const order = [top[1], top[0], top[2]].filter(Boolean)
  const heights = ['h-28', 'h-40', 'h-24']
  const medals = ['silver', 'gold', 'bronze']
  return (
    <div className="flex items-end justify-center gap-3">
      {order.map((p, i) => (
        <div key={p.id} className="anim-podium flex w-24 flex-col items-center" style={{ animationDelay: `${i * 0.15}s` }}>
          <div className="mb-1"><Icon name={medals[top.indexOf(p) === 0 ? 1 : top.indexOf(p) === 1 ? 0 : 2]} size={36} /></div>
          <div className="mb-2 max-w-24 truncate font-display font-medium">{p.name}</div>
          <div className={`w-full rounded-t-xl bg-white/15 text-center backdrop-blur ${heights[i]}`}>
            <div className="pt-2 font-display text-lg font-semibold text-[#ffcf00]">{fmt(p.score)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnswerGrid({ answers, correct, reveal, counts }) {
  const total = (counts || []).reduce((s, n) => s + n, 0)
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {answers.map((a, i) => {
        const isRight = reveal && i === correct
        const dim = reveal && i !== correct
        return (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-2xl px-4 py-4 font-display text-lg font-medium transition-all duration-300 ${ANSWER_STYLES[i]} ${isRight ? 'scale-[1.03] brightness-110 ring-4 ring-white' : ''} ${dim ? 'opacity-35 saturate-50' : ''}`}
          >
            <span className="text-2xl">{SHAPES[i]}</span>
            <span className="flex-1">{a}</span>
            {reveal && total > 0 && (
              <span className="rounded-full bg-black/25 px-2 py-0.5 text-sm">{counts[i]}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------- host ----------

function Host({ code }) {
  const [players, setPlayers] = useState([]) // {id,name,score,streak,last}
  const [phase, setPhase] = useState('lobby') // lobby | question | reveal | final
  const [pack, setPack] = useState(PACKS[0])
  const [qi, setQi] = useState(0)
  const [endsAt, setEndsAt] = useState(0)
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const [answerCount, setAnswerCount] = useState(0)
  const chanRef = useRef(null)
  const playersRef = useRef([])
  const answeredRef = useRef(new Set())
  const startedAtRef = useRef(0)

  playersRef.current = players

  const send = useCallback((payload) => {
    chanRef.current?.send({ type: 'broadcast', event: 'game', payload })
  }, [])

  useEffect(() => {
    const ch = supabase.channel(`kahoot-lite:room-${code}`, { config: { broadcast: { self: false } } })
    chanRef.current = ch
    ch.on('broadcast', { event: 'join' }, ({ payload }) => {
      setPlayers((ps) => {
        if (ps.some((p) => p.id === payload.id)) return ps
        const np = [...ps, { id: payload.id, name: payload.name, score: 0, streak: 0, last: null }]
        setTimeout(() => send({ type: 'roster', players: np.map(({ id, name, score }) => ({ id, name, score })) }), 50)
        return np
      })
    })
    ch.on('broadcast', { event: 'answer' }, ({ payload }) => {
      const { id, choice, q } = payload
      if (q !== qiRef.current) return
      if (answeredRef.current.has(id)) return
      answeredRef.current.add(id)
      const elapsed = (Date.now() - startedAtRef.current) / 1000
      const speed = Math.max(0, 1 - elapsed / Q_TIME)
      const correct = choice === PACKS_REF.current.questions[qiRef.current].c
      setCounts((cs) => cs.map((n, i) => (i === choice ? n + 1 : n)))
      setAnswerCount((n) => n + 1)
      setPlayers((ps) =>
        ps.map((p) => {
          if (p.id !== id) return p
          if (!correct) return { ...p, streak: 0, last: { ok: false, pts: 0 } }
          const streak = p.streak + 1
          const pts = Math.round(500 + 500 * speed) + Math.min(500, (streak - 1) * 100)
          return { ...p, score: p.score + pts, streak, last: { ok: true, pts } }
        }),
      )
      // tell that player their result right away
      setTimeout(() => {
        const p = playersRef.current.find((x) => x.id === id)
        send({ type: 'result', id, ok: correct, pts: p?.last?.pts ?? 0, streak: p?.streak ?? 0, score: p?.score ?? 0 })
      }, 50)
    })
    ch.subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const qiRef = useRef(0)
  const PACKS_REF = useRef(pack)
  PACKS_REF.current = pack

  const startQuestion = (idx) => {
    qiRef.current = idx
    setQi(idx)
    answeredRef.current = new Set()
    setCounts([0, 0, 0, 0])
    setAnswerCount(0)
    const end = Date.now() + Q_TIME * 1000
    startedAtRef.current = Date.now()
    setEndsAt(end)
    setPhase('question')
    send({ type: 'question', q: idx, total: pack.questions.length, endsAt: end })
    setTimeout(() => reveal(idx), Q_TIME * 1000 + 400)
  }

  const reveal = (idx) => {
    if (qiRef.current !== idx) return
    const ranked = [...playersRef.current].sort((a, b) => b.score - a.score)
    setPhase('reveal')
    send({
      type: 'reveal',
      q: idx,
      correct: PACKS_REF.current.questions[idx].c,
      scores: ranked.slice(0, 10).map(({ id, name, score }) => ({ id, name, score })),
    })
  }

  const next = () => {
    if (qi + 1 >= pack.questions.length) {
      const ranked = [...playersRef.current].sort((a, b) => b.score - a.score)
      setPhase('final')
      send({ type: 'final', scores: ranked.map(({ id, name, score }) => ({ id, name, score })) })
    } else {
      startQuestion(qi + 1)
    }
  }

  const question = pack.questions[qi]
  const ranked = [...players].sort((a, b) => b.score - a.score)
  const joinUrl = `${location.origin}${location.pathname}#/play/${code}`

  return (
    <Grain>
      <Logo />
      <div className="mt-2 text-center text-white/70">hosting room</div>

      {phase === 'lobby' && (
        <div className="anim-pop mx-auto mt-6 w-full max-w-2xl rounded-3xl bg-white/10 p-6 text-center backdrop-blur">
          <div className="text-white/70">Join at this page with code</div>
          <div className="my-3 font-display text-6xl font-semibold tracking-[0.2em] text-[#ffcf00]">{code}</div>
          <div className="mx-auto max-w-full truncate rounded-xl bg-black/25 px-3 py-2 text-sm text-white/80">{joinUrl}</div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {PACKS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPack(p)}
                className={`rounded-full px-4 py-2 font-display font-medium transition ${pack.id === p.id ? 'bg-[#ffcf00] text-grape' : 'bg-white/15 hover:bg-white/25'}`}
              >
                <span className="inline-flex items-center gap-2"><Icon name={p.icon} size={18} /> {p.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 min-h-16">
            {players.length === 0 ? (
              <div className="text-white/60">Waiting for players… open the link in another tab to join.</div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {players.map((p) => (
                  <span key={p.id} className="anim-pop rounded-full bg-white/20 px-4 py-1.5 font-display">{p.name}</span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => startQuestion(0)}
            disabled={players.length === 0}
            className="mt-6 rounded-2xl bg-[#26890c] px-10 py-4 font-display text-2xl font-semibold shadow-[0_6px_0_#1b6408] transition enabled:hover:brightness-110 enabled:active:translate-y-1 enabled:active:shadow-none disabled:opacity-40"
          >
            Start quiz
          </button>
          <div className="mt-2 text-sm text-white/60">{players.length} player{players.length === 1 ? '' : 's'} in</div>
        </div>
      )}

      {(phase === 'question' || phase === 'reveal') && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-white/15 px-4 py-1.5 font-display">
              {qi + 1} / {pack.questions.length}
            </div>
            {phase === 'question' ? <Countdown endsAt={endsAt} /> : <div className="h-16" />}
            <div className="rounded-full bg-white/15 px-4 py-1.5 font-display">
              {answerCount} answer{answerCount === 1 ? '' : 's'}
            </div>
          </div>

          <div className="anim-pop rounded-3xl bg-white px-6 py-8 text-center font-display text-2xl font-semibold text-grape sm:text-3xl" key={qi}>
            {question.q}
          </div>

          <AnswerGrid answers={question.a} correct={question.c} reveal={phase === 'reveal'} counts={counts} />

          {phase === 'reveal' && (
            <div className="anim-pop mx-auto w-full max-w-xl rounded-3xl bg-white/10 p-5 backdrop-blur">
              <div className="mb-3 text-center font-display text-xl font-semibold text-[#ffcf00]">Leaderboard</div>
              {ranked.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-white/5">
                  <span className="w-6 text-center font-display">{i + 1}</span>
                  <span className="flex-1 truncate font-display">{p.name}</span>
                  {p.streak >= 2 && <span title="streak" className="inline-flex items-center gap-0.5"><Icon name="flame" size={14} />{p.streak}</span>}
                  <span className="font-display font-semibold">{fmt(p.score)}</span>
                </div>
              ))}
              <button
                onClick={next}
                className="mt-4 w-full rounded-2xl bg-[#1368ce] py-3 font-display text-xl font-semibold shadow-[0_6px_0_#0b4a94] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
              >
                {qi + 1 >= pack.questions.length ? 'Show final podium' : 'Next question'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'final' && (
        <div className="mt-10 flex flex-col items-center gap-8">
          <div className="anim-pop text-center font-display text-4xl font-semibold text-[#ffcf00]">Final podium</div>
          <Podium players={ranked} />
          <div className="w-full max-w-md">
            {ranked.slice(3).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-2 odd:bg-white/5">
                <span className="w-6 text-center font-display">{i + 4}</span>
                <span className="flex-1 truncate">{p.name}</span>
                <span className="font-display font-semibold">{fmt(p.score)}</span>
              </div>
            ))}
          </div>
          <a href="#/" className="rounded-2xl bg-white/15 px-8 py-3 font-display text-lg hover:bg-white/25">Host another game</a>
        </div>
      )}
    </Grain>
  )
}

// ---------- player ----------

function Play({ code }) {
  const [me] = useState(() => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random())))
  const [name, setName] = useState('')
  const [joined, setJoined] = useState(false)
  const [phase, setPhase] = useState('lobby')
  const [total, setTotal] = useState(0)
  const [endsAt, setEndsAt] = useState(0)
  const [picked, setPicked] = useState(null)
  const [result, setResult] = useState(null) // {ok, pts, streak, score}
  const [reveal, setReveal] = useState(null) // {correct, myRank, scores}
  const [finalScores, setFinalScores] = useState(null)
  const chanRef = useRef(null)
  const qiRef = useRef(0)
  const resultRef = useRef(null)
  resultRef.current = result

  useEffect(() => {
    const ch = supabase.channel(`kahoot-lite:room-${code}`, { config: { broadcast: { self: false } } })
    chanRef.current = ch
    ch.on('broadcast', { event: 'game' }, ({ payload }) => {
      const m = payload
      if (m.type === 'question') {
        qiRef.current = m.q
        setTotal(m.total)
        setEndsAt(m.endsAt)
        setPicked(null)
        setResult(null)
        setReveal(null)
        setPhase('question')
      } else if (m.type === 'reveal') {
        setReveal(m)
        setPhase('reveal')
      } else if (m.type === 'final') {
        setFinalScores(m.scores)
        setPhase('final')
      } else if (m.type === 'result' && m.id === me) {
        setResult({ ok: m.ok, pts: m.pts, streak: m.streak, score: m.score })
      }
    })
    ch.subscribe()
    return () => supabase.removeChannel(ch)
  }, [code, me])

  const join = () => {
    if (!name.trim()) return
    chanRef.current?.send({ type: 'broadcast', event: 'join', payload: { id: me, name: name.trim().slice(0, 16) } })
    setJoined(true)
    // re-announce in case the host subscribed late
    setTimeout(() => chanRef.current?.send({ type: 'broadcast', event: 'join', payload: { id: me, name: name.trim().slice(0, 16) } }), 1500)
  }

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    chanRef.current?.send({ type: 'broadcast', event: 'answer', payload: { id: me, choice: i, q: qiRef.current } })
  }

  const myFinalRank = finalScores ? finalScores.findIndex((s) => s.id === me) : -1

  return (
    <Grain>
      <Logo />
      <div className="mt-2 text-center text-white/70">room {code}</div>

      {!joined && (
        <div className="anim-pop mx-auto mt-10 w-full max-w-sm rounded-3xl bg-white/10 p-6 backdrop-blur">
          <label className="mb-2 block font-display text-lg">Your nickname</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && join()}
            maxLength={16}
            placeholder="e.g. Nefertiti"
            className="w-full rounded-2xl bg-white px-4 py-3 font-display text-lg text-grape outline-none placeholder:text-grape/40"
          />
          <button
            onClick={join}
            className="mt-4 w-full rounded-2xl bg-[#26890c] py-3.5 font-display text-xl font-semibold shadow-[0_6px_0_#1b6408] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
          >
            Join room
          </button>
        </div>
      )}

      {joined && phase === 'lobby' && (
        <div className="anim-pop mx-auto mt-16 text-center">
          <div className="anim-float"><Icon name="party" size={72} /></div>
          <div className="mt-4 font-display text-3xl font-semibold">You're in, {name}!</div>
          <div className="mt-2 text-white/70">See your name up on the host screen. Get ready…</div>
        </div>
      )}

      {joined && phase === 'question' && (
        <div className="mt-6 flex flex-1 flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-white/15 px-4 py-1.5 font-display">Q{qiRef.current + 1}/{total}</div>
            <Countdown endsAt={endsAt} />
            <div className="w-16 text-right font-display text-[#ffcf00]">{result ? fmt(result.score) : ''}</div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {SHAPES.map((s, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`anim-pop flex items-center justify-center rounded-3xl font-display text-6xl transition enabled:hover:scale-[1.03] enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-default ${ANSWER_STYLES[i]} ${picked !== null && picked !== i ? 'opacity-40' : ''}`}
                style={{ animationDelay: `${i * 0.07}s`, minHeight: '9rem' }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="h-10 text-center font-display text-lg">
            {picked !== null && !result && <span className="text-white/70">Answer locked in…</span>}
            {result && (
              <span className={`anim-pop inline-block rounded-full px-5 py-1.5 ${result.ok ? 'bg-[#26890c]' : 'bg-[#e21b3c]'}`}>
                {result.ok ? `Correct! +${fmt(result.pts)}` : 'Not this time'} {result.streak >= 2 && `${result.streak} streak`}
              </span>
            )}
          </div>
        </div>
      )}

      {joined && phase === 'reveal' && reveal && (
        <div className="anim-pop mx-auto mt-10 w-full max-w-md text-center">
          <div className={`rounded-3xl px-6 py-8 font-display text-3xl font-semibold ${result?.ok ? 'bg-[#26890c]' : picked === null ? 'bg-white/15' : 'bg-[#e21b3c]'}`}>
            {picked === null ? 'Time ran out!' : result?.ok ? 'Correct!' : 'Wrong one'}
          </div>
          {result && <div className="mt-4 font-display text-xl text-[#ffcf00]">Score: {fmt(result.score)}</div>}
          <div className="mt-6 rounded-3xl bg-white/10 p-4 text-left backdrop-blur">
            <div className="mb-2 text-center font-display text-lg text-[#ffcf00]">Top players</div>
            {reveal.scores.slice(0, 5).map((s, i) => (
              <div key={s.id} className={`flex items-center gap-3 rounded-xl px-3 py-1.5 odd:bg-white/5 ${s.id === me ? 'ring-2 ring-[#ffcf00]' : ''}`}>
                <span className="w-5 text-center">{i + 1}</span>
                <span className="flex-1 truncate">{s.name}{s.id === me ? ' (you)' : ''}</span>
                <span className="font-display font-semibold">{fmt(s.score)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-white/70">Next question is on its way…</div>
        </div>
      )}

      {joined && phase === 'final' && finalScores && (
        <div className="anim-pop mx-auto mt-10 w-full max-w-md text-center">
          <div className="anim-float text-6xl"><Icon name={myFinalRank === 0 ? 'crown' : myFinalRank === 1 ? 'silver' : myFinalRank === 2 ? 'bronze' : 'flag'} size={72} /></div>
          <div className="mt-3 font-display text-3xl font-semibold">
            {myFinalRank === 0 ? 'You won!' : myFinalRank > 0 ? `You placed #${myFinalRank + 1}` : 'Quiz over!'}
          </div>
          {myFinalRank >= 0 && (
            <div className="mt-1 font-display text-xl text-[#ffcf00]">{fmt(finalScores[myFinalRank].score)} points</div>
          )}
          <a href="#/" className="mt-6 inline-block rounded-2xl bg-white/15 px-8 py-3 font-display text-lg hover:bg-white/25">Back to start</a>
        </div>
      )}
    </Grain>
  )
}

// ---------- landing ----------

function Home() {
  const [code, setCode] = useState('')
  const [hostCode, setHostCode] = useState(null)

  if (hostCode) {
    location.hash = `#/host/${hostCode}`
    setHostCode(null)
  }

  return (
    <Grain>
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <div className="text-center">
          <div className="anim-pop font-display text-6xl font-semibold tracking-wide sm:text-7xl">
            kahoot<span className="text-[#ffcf00]">·</span>lite
          </div>
          <p className="mt-3 text-lg text-white/75">Live quiz rooms for friends, classes and team calls. No sign-up.</p>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <div className="anim-pop rounded-3xl bg-white/10 p-6 backdrop-blur" style={{ animationDelay: '0.1s' }}>
            <Icon name="mic" size={40} />
            <div className="mt-2 font-display text-2xl font-semibold">Host a quiz</div>
            <p className="mt-1 text-sm text-white/70">Get a room code, pick a pack, run the game from this screen.</p>
            <button
              onClick={() => (location.hash = `#/host/${makeCode()}`)}
              className="mt-4 w-full rounded-2xl bg-[#26890c] py-3 font-display text-xl font-semibold shadow-[0_6px_0_#1b6408] transition hover:brightness-110 active:translate-y-1 active:shadow-none"
            >
              Create room
            </button>
          </div>

          <div className="anim-pop rounded-3xl bg-white/10 p-6 backdrop-blur" style={{ animationDelay: '0.2s' }}>
            <Icon name="phone" size={40} />
            <div className="mt-2 font-display text-2xl font-semibold">Join a game</div>
            <p className="mt-1 text-sm text-white/70">Got a code? Pop it in and play along live.</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
              onKeyDown={(e) => e.key === 'Enter' && code.length === 5 && (location.hash = `#/play/${code}`)}
              placeholder="CODE"
              className="mt-4 w-full rounded-2xl bg-white px-4 py-2.5 text-center font-display text-xl tracking-[0.3em] text-grape outline-none placeholder:text-grape/40"
            />
            <button
              onClick={() => code.length === 5 && (location.hash = `#/play/${code}`)}
              disabled={code.length !== 5}
              className="mt-3 w-full rounded-2xl bg-[#1368ce] py-3 font-display text-xl font-semibold shadow-[0_6px_0_#0b4a94] transition enabled:hover:brightness-110 enabled:active:translate-y-1 enabled:active:shadow-none disabled:opacity-40"
            >
              Join
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-sm text-white/60">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><Icon name="bolt" size={14} /> real-time over Supabase</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><Icon name="flame" size={14} /> streak scoring</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><Icon name="trophy" size={14} /> live podium</span>
        </div>
      </div>
    </Grain>
  )
}

// ---------- router ----------

function useHashRoute() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const fn = () => setHash(location.hash)
    addEventListener('hashchange', fn)
    return () => removeEventListener('hashchange', fn)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  const hostMatch = hash.match(/^#\/host\/([A-Z0-9]{5})/)
  const playMatch = hash.match(/^#\/play\/([A-Z0-9]{5})/)
  if (hostMatch) return <Host code={hostMatch[1]} key={hostMatch[1]} />
  if (playMatch) return <Play code={playMatch[1]} key={playMatch[1]} />
  return <Home />
}
