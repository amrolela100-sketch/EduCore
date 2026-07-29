# Autonomous Recruitment Hub — حزمة برومتات التصميم لـ Stitch

## ملاحظات قبل ما تبلش

- استخدم وضع **Experimental** (مو Standard) — الجودة أهم من السرعة هون، وبيعطيك تصدير كود مباشر بدل ما يوقف عند Figma بس.
- اختار **Web** كنوع المشروع (المنصة Next.js، مش تطبيق موبايل).
- الصق كل برومت **لحاله، وحدة وحدة، بالترتيب**. لا تدمجهم ببعض برسالة وحدة — البرومتات الطويلة (فوق ~٥٠٠٠ حرف) بتخلي Stitch يفوت عناصر، بينما التعديلات المتتالية القصيرة بتنتج نتيجة أدق وأثبت. كل برومت تحت مصمم يضل تحت هالحد بمسافة مريحة.
- بعد ما تولّد كل الشاشات، الصق **برومت التثبيت** الأخير (رقم ٩) حتى Stitch يراجع كل الشاشات مع بعض ويوحّد الألوان والخطوط بينها.
- إذا شفت خانة اسمها DESIGN.md بمشروعك جوه Stitch (ميزة أضيفت بالتحديثات الأخيرة)، فيك تحط فيها نفس نظام الألوان/الخطوط تحت كمرجع دائم يرجعلها تلقائياً. مش أساسية — البرومتات تحت كافية لحالها.
- الشاشات مرتبة على **نفس منطق الـ Execution Model** يلي حاطه بوثيقة المشروع: أول loop كامل (candidate → HR dashboard)، وبعدها لوحتي Tech Admin و System Admin. كل البرومتات جاهزة تحت من هلق — بس إذا حابب تتبع خطة التسليم عندك بالحرف (Admin dashboards خطوة ١١)، فيك ببساطة تأجل برومت ٧ و٨ وتستخدمهم لما توصلها.

---

## الفكرة التصميمية

المشروع بحد ذاته بيوضع نفسه إنه نقيض الـ "black-box AI hiring": كل قرار من الوكلاء (نسبة التطابق، تقييم المقابلة، الترتيب) لازم يترافق بتبرير مكتوب بلغة بشرية، مخزّن بالداتابيز، وقابل لمراجعة إنسان. هاي مو بس متطلب compliance (EU AI Act) — هاي أقوى فكرة تصميمية ممكن تُبنى عليها الواجهة كلها.

فبدل ما "الشفافية" تضل شعار تسويقي، خليتها عنصر تصميمي متكرر بكل مكان بيظهر فيه Score أو قرار من وكيل AI — سميته **Reasoning Strip**: خط رفيع تحت أي نسبة تطابق أو تقييم، فيه سطر تبرير واضح بالخط الرقمي (مونوسبيس)، ظاهر دايماً ومش مخبى وراء tooltip.

وبنيت نظام الألوان على نفس المنطق: لون واحد لأي قرار مصدره AI (Verified)، ولون تاني منفصل تماماً للحظات القرار البشري (Human) — التمييز البصري بينهم هو نفسه رسالة المنتج (AI بيساعد، الإنسان بيقرر).

تجنبت قصداً الأنماط يلي صارت شبه "توقيع" لأدوات تصميم الـ AI: خلفية كريمية دافية + خط serif متباين + لون تراكوتا (تركيبة صارت كليشيه بحالها)، أو خلفية سوداء تقريباً + لون نيون صارخ وحيد، أو تدرجات بنفسجي-أزرق جاهزة، أو glassmorphism وأيقونات "سحرية" (نجوم/توهج)، أو hero نمطي (عنوان بالنص + ٣ أيقونات بدوائر تحته).

## نظام الألوان

| الاسم | Hex | الاستخدام |
|---|---|---|
| Paper | `#F5F6F2` | الخلفية الأساسية — أبيض بارد هادئ، مش كريمي دافي |
| Ink | `#1B211D` | النص الأساسي — أسود تقريباً بميلان أخضر خفيف |
| Verified | `#14665A` | اللون الأساسي — لأي حالة أو زر مصدره قرار AI |
| Human | `#B8752F` | لون منفصل — مخصص فقط للحظات قرار إنسان (override، مراجعة، قرار نهائي) |
| Flag | `#9B3B2C` | أحمر مطفي — لعلامات الخطر/الرفض بس، استخدام قليل ومقصود |
| Ledger | `#D7DAD1` | رمادي دافي فاتح — للحدود، الفواصل، خطوط الجداول |

## الخطوط

- **العناوين:** Space Grotesk — خط grotesque بشخصية واضحة، مش الخط المدور الافتراضي يلي بتشوفه بكل مكان
- **النص:** IBM Plex Sans — واضح ومهني، وبعيد عن Inter يلي صار الخيار الافتراضي شبه بكل أداة AI
- **البيانات/الأرقام:** IBM Plex Mono — مخصص فقط لأي شي رقمي (نسب التطابق، الـ Scores، الترتيب، التواريخ) — بيعطي إحساس "سجل موثّق" وبيسهّل محاذاة الأرقام بالجداول

---

## البرومتات (بالإنكليزي — جاهزة للنسخ داخل Stitch)

### Prompt 0 — الأساس (Design System + Landing Page)
البرومت هاد بيأسس كل نظام التصميم، فلازم يكون الأول دايماً.

```
Design a web platform called Autonomous Recruitment Hub — an AI-native recruitment platform where multiple autonomous AI agents (not humans) handle candidate profiling, job matching, interviewing, and evaluation, but every single AI decision is stored with a short human-readable justification and can be reviewed or overridden by a human. The product's core promise is the opposite of "black-box AI hiring": it is rigorous, evidence-based, and auditable. It serves two audiences: job candidates going through an AI-mediated hiring process, and HR teams who need defensible, explainable hiring intelligence.

Vibe: rigorous, quietly confident, evidence-based, calm authority — like a well-prepared case file or an audit report, not a hype-y AI startup, not a playful consumer app, not a cold generic enterprise dashboard.

Design system to use everywhere:
- Colors: Paper #F5F6F2 (background, cool quiet neutral, NOT warm cream), Ink #1B211D (primary text, near-black with a faint green-black undertone), Verified #14665A (deep teal-green — primary accent, used for AI-generated/confirmed states and primary buttons), Human #B8752F (warm ochre — a SECOND, separate accent reserved only for human-in-the-loop actions: override buttons, "reviewed by HR" tags, final decisions), Flag #9B3B2C (muted brick-red, used sparingly for risk/rejection flags only), Ledger #D7DAD1 (soft warm-gray for borders, dividers, table lines)
- Typography: display headlines in a confident, slightly condensed grotesque sans (Space Grotesk or similar structured geometric sans, NOT a generic rounded sans, NOT a warm serif), body text in a clean humanist sans (IBM Plex Sans or similar — NOT Inter), and a monospace face (IBM Plex Mono or similar) reserved specifically for anything quantitative — scores, match percentages, ranking numbers, timestamps — to reinforce the "structured record" feel
- Signature component: a "Reasoning Strip" — any AI-generated score, match percentage, or badge is always paired with a small persistent one-line justification directly beneath it, set in the monospace face, never hidden behind a tooltip or a click. Default styling uses Ink text on a Ledger-colored strip; when a human has reviewed or overridden that specific item, the strip switches to a Human/ochre left border.

Explicitly avoid: warm cream backgrounds paired with high-contrast serif headlines and terracotta/clay accents; near-black backgrounds with a single neon or acid-bright accent color; generic purple-to-blue gradients; glowing or glassmorphic cards; sparkle/magic-wand/glowing-orb AI iconography; a generic centered hero followed by three icon-in-circle feature cards; numbered 01/02/03 markers unless the content is a genuine sequence; using Inter as the only typeface; heavy or scattered animation.

Now design the marketing landing page (unauthenticated visitors): a hero section that states plainly what the platform does and for whom, a brief visual explanation of the agent pipeline (Profile → Match → Interview → Evaluate → Rank) framed around transparency rather than automation-for-its-own-sake, one section showing a preview of the Reasoning Strip component with realistic sample content, and two clearly separated primary calls to action: "For Candidates" and "For Employers." Desktop web layout, generous whitespace, no stock-photo-style AI-generated people.
```

### Prompt 1 — تسجيل الدخول / إنشاء حساب للمرشح
شاشة هادئة ومطمئنة — المرشح رح يمر بعملية تقييم AI، لازم يحس باحترام من أول شاشة.

```
Continue in the same design system (Paper/Ink/Verified/Human/Flag/Ledger palette, Space Grotesk + IBM Plex Sans + IBM Plex Mono). Design the candidate sign-up and login screen. Keep it calm and reassuring — a candidate about to go through an AI-mediated hiring process should feel respected from the first screen, not processed. Simple centered form, single primary action per state (sign up vs. log in as a toggle, not two separate pages), minimal fields (email, password, name), a short one-line reassurance near the form referencing that every decision in the process is explainable and human-reviewable. No stock illustration, no decorative gradient panel — let typography and whitespace carry the screen.
```

### Prompt 2 — لوحة المرشح ووظائف التطابق
أول ظهور حقيقي لعنصر الـ Reasoning Strip بمحتوى فعلي.

```
Same design system. Design the candidate's dashboard after their profile has been auto-built from their uploaded resume. Show a short profile summary card at the top (extracted skills, experience level — auto-generated, clearly labeled as such), then a list of matched job postings below. Each job card shows: role title, company, a match percentage in the monospace face, and a Reasoning Strip directly under the percentage with a short justification (e.g., which required skills matched, which are missing). Cards are ranked by match percentage. Include a filter bar (role type, location, match threshold). This is the first real appearance of the Reasoning Strip with live content — make sure it's visually integrated into the card, not an afterthought.
```

### Prompt 3 — صفحة الوظيفة والتقديم
رفع السيرة الذاتية بخطوة وحدة، بدون wizard متعدد المراحل.

```
Same design system. Design the job posting detail page and application flow. Top section: full job description, requirements, company info. A persistent "Apply" action. The apply flow is a single upload step: drag-and-drop area for resume/portfolio (PDF, DOCX, or ZIP), with reassuring copy that the candidate uploads once and their profile is used across every application — no repeated forms. Show a brief processing state (profile being extracted) that leads into a confirmation with the match percentage and Reasoning Strip from the previous screen's pattern. Keep the upload step to one screen, not a multi-step wizard.
```

### Prompt 4 — جلسة المقابلة (مهندس برمجيات، تنفيذ كود Sandboxed)
أكثر شاشة "تقنية" — لازم توحي بالأمان والهدوء، مش الذعر من مؤقت متسارع.

```
Same design system. Design the live interview session screen for a Software Engineer candidate. Layout: a left panel with the coding challenge description (role-calibrated, plain language, a visible timer), a center code editor panel (dark syntax-highlighted editor is fine here as a deliberate exception to the light palette, since it signals a real coding environment — but keep the surrounding chrome in the established palette), and a right panel showing test/output results as they run. Include a small, persistent, non-alarming trust signal that this code runs in an isolated sandbox — stated plainly, not as a warning banner. The interviewing agent's presence should be understated: a labeled status line ("Interview Agent — reviewing your submission"), not a cartoon avatar or chat bubble mascot. No countdown-panic styling; the timer should feel steady, not stressful.
```

### Prompt 5 — نتائج المرشح
شاشة حساسة عاطفياً — لازم كل بُعد تقييم يجيب مبرره الخاص، مو رقم واحد مجمّع.

```
Same design system. Design the candidate's results page after an interview has been evaluated. This is an emotionally high-stakes screen, so tone matters: never a bare pass/fail. Show the four evaluation dimensions from the spec — code quality, problem-solving, communication, consistency — each as its own row with a score and its own Reasoning Strip justification underneath, not one aggregate number. Above these, a clear status: "Under human review" as a distinct state from a finalized decision (per the platform's rule that no rejection is automated without human review) — use the Ledger/neutral palette for "under review" and only switch to Verified or Flag colors once a status is final. If the design shows a final "not selected" state, keep the tone respectful and specific, never cold or templated.
```

### Prompt 6 — لوحة HR Admin
جدول عمل كثيف بس واضح — بدون أي تفاصيل تقنية (هاي من صلاحيات Tech Admin بس).

```
Same design system. Design the HR Admin dashboard for a single job posting: a ranked candidate list, each row showing name, overall fit summary, and a Reasoning Strip-style justification for the ranking — written in plain hiring language (communication, culture fit, soft skills), not technical detail. This view must NOT show source code, sandbox execution logs, or raw technical scores — that's Tech Admin only. Include filter and search controls above the list, and a per-candidate action to flag for deeper human review or mark a final decision, using the Human/ochre accent specifically for that action to visually distinguish human decisions from AI-generated ranking. Dense but legible data table layout, not oversized cards — this is a working tool for someone reviewing many candidates in one sitting.
```

### Prompt 7 — لوحة Tech Admin
نفس الهيكل تماماً متل لوحة HR، بس بمحتوى مختلف — نفس المرشح، عدسة تقنية بدل الموارد البشرية.

```
Same design system. Design the Tech Admin dashboard for the same job posting shown in the HR Admin dashboard — reuse the same candidate list shell and Reasoning Strip pattern, but this view surfaces exactly what the HR dashboard hides. For a selected candidate, show their interview code submission (syntax-highlighted, read-only), the sandbox execution log (pass/fail per test case, runtime), and the Evaluation Subagent's technical scores — code quality and problem-solving — each with its own Reasoning Strip justification. No soft-skill or culture-fit content here; that's HR-only. Include a clear role indicator in the header so it's unmistakable this is the Tech Admin view. No editing controls on any HR-owned field, since Tech Admin cannot edit HR evaluations.
```

### Prompt 8 — لوحة System Admin
هون بالذات ما منستخدم الـ Reasoning Strip — هاي شاشة إعدادات تشغيلية، مش تقييم.

```
Same design system. Design the System Admin dashboard — a platform configuration hub, not a candidate-evaluation view. The Reasoning Strip pattern from the other screens does not apply here; keep this as a clean operational settings interface instead. Use a left-side section navigation with four areas: Companies (list of employer accounts, add or suspend), Users (list of all platform users across roles, with role badges), Permissions (a simple matrix showing which of the four roles — Candidate, HR Admin, Tech Admin, System Admin — can access which areas), and AI Settings (the model or version currently in use per agent, with a visible log of when settings last changed and by whom). This screen should feel more like infrastructure tooling than a product page — denser, fewer large headlines, more tables and toggles.
```

### Prompt 9 — التثبيت النهائي (شغّله بعد كل الشاشات فوق)

```
Review every screen generated in this project so far — landing page, candidate auth, candidate dashboard, job detail, interview session, candidate results, HR Admin dashboard, Tech Admin dashboard, and System Admin dashboard. Make sure they all share exactly the same color palette (Paper #F5F6F2, Ink #1B211D, Verified #14665A, Human #B8752F, Flag #9B3B2C, Ledger #D7DAD1) and the same three typefaces (Space Grotesk for display, IBM Plex Sans for body, IBM Plex Mono for scores/data). The Reasoning Strip component should look identical wherever it appears — candidate dashboard, HR Admin, Tech Admin — same monospace treatment, same default vs. human-override styling. The System Admin dashboard is the one intentional exception: it shares the palette and type system but does not use the Reasoning Strip pattern, since it's a configuration tool, not an evaluation view. Fix any screen that introduced a different accent color, a different font, or an inconsistent Reasoning Strip treatment.
```

---

## شو ناقص لو حبيت تكمل أكتر

الأربع أدوار (Candidate, HR Admin, Tech Admin, System Admin) صار عندهم شاشاتهم الأساسية. أشياء ما غطيتها لأنها مو مذكورة كخطوة مستقلة بوثيقة المشروع، وفيك تطلبها لو احتجتها لاحقاً: شاشة إنشاء/تعديل إعلان وظيفة (غالباً جزء من لوحة HR)، ومركز الإشعارات (موجود بالـ schema كجدول Notification بس بدون UI مستقل بالوثيقة).
