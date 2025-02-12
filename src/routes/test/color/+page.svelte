<script lang="ts">
	type DIC<T> = { [key in string]: T };
	type LCA = [number, number, number];
	const H = [0, 45, 90, 120, 150, 200, 255, 290, 320];
	const names = {
		admin:  [      ,      ,      ,,'MAKER','TITLE',       ,      ,'ADMIN'],
		open:   [      ,'VSAY','SSAY',,       ,       ,       ,      ,       ],
		wisper: ['WSAY',      ,      ,,'XSAY' ,       ,'GSAY' ,'PSAY',       ],
		think:  [      ,'TSAY', 'AIM',,       ,       ,'GAIM' ,      ,       ],
		button: [      ,      ,      ,,       ,       ,       ,      ,       ]
	}
	function by_name(mode: string, hue: number, idx: number) {
		const name = names[mode as keyof typeof names][idx];
		return name ? `.hue${hue}, .${name}` : `.hue${hue}`;
	}
	function digit3(x: number) {
		return `${Math.floor(x)}`.padStart(3, ' ');
	}
	function cent(x: number) {
		return `${Math.floor(x * 100)}`.padStart(2, ' ') + '%';
	}

	const snow     = [0.99, 0.02, 1] as LCA;  // 白（雪のような白）
	const pearl    = [0.70, 0.02, 1] as LCA;  // 銀（パールのような光沢）
	const stone    = [0.40, 0.02, 1] as LCA;  // 灰（石のような無彩色）
	const sumi     = [0.22, 0.03, 1] as LCA;  // 墨（日本の墨色）
	const coal     = [0.10, 0.03, 1] as LCA;  // 黒（石炭のような深い黒）

	const mist     = [0.95, 0.08, 1] as LCA;  // 淡い霧のような色
	const silver   = [0.70, 0.05, 1] as LCA;  // 銀
	const cloud    = [0.55, 0.06, 1] as LCA;  // 曇り空の灰色
	const shadow   = [0.25, 0.10, 1] as LCA;  // 影のような色

	const blush    = [0.83, 0.14, 1] as LCA;  // 柔らかいパステルカラー
	const clay     = [0.55, 0.18, 1] as LCA;  // 土のような中間色
	const bark     = [0.25, 0.20, 1] as LCA;  // 木の皮のような深い色

	const highlight = [0.90, 0.30, 1] as LCA; // 目立つマーキング用
	const ember     = [0.64, 0.18, 1] as LCA; // 燃えさしのような強めの色
	const crystal   = [0.33, 0.22, 1] as LCA; // 透け感のある色（ガラスのような）


	const themes: DIC<DIC<[LCA, LCA, LCA, LCA]>> = {
		dark: {
			admin:  [coal,    bark,    blush, pearl],
			open:   [crystal, sumi,    mist,  highlight],
			wisper: [bark,    crystal, blush, highlight],
			think:  [sumi,    bark,    blush, highlight],
			button: [crystal, bark,    blush, highlight],
		},
		std: {
			admin:  [pearl, ember, sumi, bark],
			open:   [ember, pearl, sumi, crystal],
			wisper: [clay,  ember, bark,  crystal],
			think:  [cloud, clay,  bark,  crystal],
			button: [ember, clay,  bark,  crystal],
		},
		snow: {
			admin:  [snow,    blush,   bark, clay],
			open:   [blush,   snow,    stone, crystal],
			wisper: [ember,   blush,   bark, crystal],
			think:  [silver,  ember,   bark, crystal],
			button: [blush,   ember,   bark, crystal],
		}
	};

	let dates = $state<{ [key in string]: string }>({});
</script>

<div>
	{#each Object.keys(themes) as theme}
		{#each Object.keys(themes[theme]) as mode}
			{@const [[bgl, bgc, bga], [forml, formc, forma], [penl, penc, pena], [boldl, boldc, bolda]] =
				themes[theme][mode]}
			<h2>{theme} {mode}</h2>
			<div class="list">
				{#each H as hue, idx}
					<div
						class="msg"
						style="
--bg-color:   oklch( {cent(bgl)} {cent(bgc)} {digit3(hue)} / {cent(bga)});
--form-color: oklch( {cent(forml)} {cent(formc)} {digit3(hue)} / {cent(forma)});
--pen-color:  oklch( {cent(penl)} {cent(penc)} {digit3(hue)} / {cent(pena)});
--bold-color: oklch( {cent(boldl)} {cent(boldc)} {digit3(hue)} / {cent(bolda)});
			"
					>
						<p class="c2">
							<b>太文字</b><del class="badge">消し線</del>普通の文字 {by_name(mode, hue, idx)}
						</p>
						<hr />
						<ol>
							<li>
								<del>記入</del>
								<input type="range" />
							</li>
							<li>
								<input type="number" placeholder="test" />
							</li>
							<li>
								<input type="date" bind:value={dates[`${hue}`]} />
								<input type="time" />
							</li>
							<li>
								<button>更新</button>
								{dates[`${hue}`]}
							</li>
						</ol>
					</div>
				{/each}
			</div>
		{/each}
	{/each}
</div>

<pre style="font-size: 10px;">
{#each Object.keys(themes) as theme}.{theme} {'{'}
{#each Object.keys(themes[theme]) as mode}	.{mode} {'{'}
{@const [
				[bgl, bgc, bga],
				[forml, formc, forma],
				[penl, penc, pena],
				[boldl, boldc, bolda]
			] = themes[theme][mode]}
{#each H as hue, idx}		{by_name(mode,hue,idx)} {'{'}
			--bg-color:   oklch( {cent(bgl)} {cent(bgc)} {digit3(hue)} / {cent(bga)});
			--form-color: oklch( {cent(forml)} {cent(formc)} {digit3(hue)} / {cent(forma)});
			--pen-color:  oklch( {cent(penl)} {cent(penc)} {digit3(hue)} / {cent(pena)});
			--bold-color: oklch( {cent(boldl)} {cent(boldc)} {digit3(hue)} / {cent(bolda)});
		{'}'}
{/each}	{'}'}
{/each}{'}'}
{/each}
</pre>

<style>
	.list {
		display: flex;
		justify-content: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
		align-items: center;
	}
	.c2 {
		column-count: 2;
		column-gap: 1ex;
	}
	.msg {
		border-width: 0.05px 0 0.05px 0.8em;
		border-style: solid;
		width: 14em;
		margin: 4px;
		padding: 0 1ex;

		background: var(--bg-color);
		color: var(--pen-color);
		accent-color: var(--pen-color);
		text-decoration-color: var(--pen-color);
		text-emphasis-color: var(--pen-color);
		border-color: var(--form-color);
		column-rule-color: var(--bold-color);
		caret-color: var(--bold-color);
		::selection {
			background: var(--form-color);
		}
		.badge {
			padding: 0 1ex;
			border-radius: 1em;
			background: var(--bold-color);
			color: var(--bg-color);
		}
		p {
			column-rule-width: 0.05px;
			column-rule-style: dotted;
			padding: 0;
			margin: 0.5em 0;
		}
		b {
			color: var(--bold-color);
		}
		hr {
			border: 0.1ex dashed;
			border-color: var(--bold-color);
		}
		li::marker {
			color: var(--bold-color);
		}
		button {
			border-style: none;
			background: var(--form-color);
			color: var(--bold-color);
			border-color: var(--pen-color);
		}
		button:active {
			background: var(--bg-color);
			outline-width: 4px;
			outline-style: solid;
			outline-color: var(--bold-color);
		}
		input {
			border-width: 0.01px;
			border-style: dotted;
			color: var(--pen-color);
			background: var(--form-color);
			border-color: var(--bold-color);
		}
		input::selection {
			background: var(--bg-color);
		}
		input:focus {
			border-color: var(--form-color);
			outline-width: 4px;
			outline-style: dotted;
			outline-color: var(--bold-color);
		}
		input::placeholder {
			color: var(--bold-color);
		}
	}
</style>
