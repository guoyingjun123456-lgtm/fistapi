#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

def num(s):
    s = s.strip()
    if s in ('-', '', '—'):
        return None
    try:
        return float(s)
    except ValueError:
        return None

# ---- parse pricing.txt ----
textgen = {}   # model -> list of rows (input, output, impl_cache, expl_hit_cache)
embed = {}     # model -> input price
section = None
for raw in open('/root/pricing.txt', encoding='utf-8'):
    line = raw.rstrip('\n')
    if not line.strip():
        continue
    if line.startswith('#'):
        section = line[1:].strip()
        continue
    cols = line.split('\t')
    if len(cols) == 1:
        cols = line.split()
    if section == 'TEXTGEN':
        # 子分类 模型 输入范围 模式 输入价 输出价 隐式缓存 显式创建 显式命中
        if len(cols) < 9:
            print("WARN bad textgen row:", repr(line)); continue
        model = cols[1]
        inp, outp = num(cols[4]), num(cols[5])
        impl = num(cols[6]); expl_hit = num(cols[8])
        textgen.setdefault(model, []).append((inp, outp, impl, expl_hit))
    elif section == 'EMBED':
        model = cols[1]
        embed[model] = num(cols[2])

# ---- collapse each text model: lowest input tier + highest output at that tier ----
priced = {}  # model -> (input, output, cache)
for model, rows in textgen.items():
    rows = [r for r in rows if r[0] is not None]
    if not rows:
        continue
    min_in = min(r[0] for r in rows)
    tier_rows = [r for r in rows if r[0] == min_in]
    out = max((r[1] for r in tier_rows if r[1] is not None), default=None)
    # cache: prefer implicit-hit, else explicit-hit, among tier rows
    cache = None
    for r in tier_rows:
        if r[2] is not None:
            cache = r[2]; break
    if cache is None:
        for r in tier_rows:
            if r[3] is not None:
                cache = r[3]; break
    priced[model] = (min_in, out, cache)

# embeddings: input only
for model, inp in embed.items():
    if inp is not None:
        priced[model] = (inp, None, None)

# ---- load channel 3 models & current ratio JSONs ----
ch_models = [m.strip() for m in open('/root/ch3_models.txt', encoding='utf-8').read().strip().split(',') if m.strip()]
def load(p):
    t = open(p, encoding='utf-8').read().strip()
    return json.loads(t) if t else {}
model_ratio = load('/root/cur_modelratio.json')
comp_ratio  = load('/root/cur_compratio.json')
cache_ratio = load('/root/cur_cacheratio.json')

USD_PER_RATIO = 2.0  # ratio 1 == $2 / 1M tokens
matched, unmatched = [], []
for m in ch_models:
    if m in priced:
        inp, out, cache = priced[m]
        mr = round(inp / USD_PER_RATIO, 6)
        model_ratio[m] = mr
        if out is not None and inp > 0:
            comp_ratio[m] = round(out / inp, 6)
        if cache is not None and inp > 0:
            cache_ratio[m] = round(cache / inp, 6)
        matched.append((m, inp, out, cache, mr, comp_ratio.get(m), cache_ratio.get(m)))
    else:
        unmatched.append(m)

# ---- write merged JSONs ----
json.dump(model_ratio, open('/root/new_modelratio.json','w'), ensure_ascii=False, separators=(',',':'))
json.dump(comp_ratio,  open('/root/new_compratio.json','w'),  ensure_ascii=False, separators=(',',':'))
json.dump(cache_ratio, open('/root/new_cacheratio.json','w'), ensure_ascii=False, separators=(',',':'))

print(f"渠道3模型总数: {len(ch_models)}   匹配上(已配价): {len(matched)}   未匹配: {len(unmatched)}\n")
print("== 已配置 (模型 | 输入$/M | 输出$/M | 缓存$/M | ModelRatio | CompRatio | CacheRatio) ==")
for r in sorted(matched):
    m, inp, out, cache, mr, cr, cc = r
    print(f"  {m:36s} {str(inp):>7} {str(out):>7} {str(cache):>7}  | {mr:<10} {('' if cr is None else cr)!s:<10} {('' if cc is None else cc)!s}")
print(f"\n== 未匹配的 {len(unmatched)} 个 (非token计费/表中无价,需单独处理) ==")
print('  ' + ', '.join(unmatched))
