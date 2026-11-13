import sys,re,json
from bs4 import BeautifulSoup
D=sys.argv[1]
products=json.load(open(f'{D}/products.json'))['result']
norm=lambda s: re.sub(r'[\s-]','',s).upper()
by_code={}
for p in products: by_code.setdefault(norm(p['title']),[]).append(p['_id'])
CODE=re.compile(r'^(PRC|PAG|PAB|POC|SQSR|SQLR|RCSR|OSR|SR|SN|SD|RC|LR|ST|CP|FC|PCD)\s?-?\d[\w-]*',re.I)
PRESSURE=re.compile(r'\d+(?:[.,]\d+)?\s*(bar|psi|lb|kg/cm2)\b',re.I)
OE=re.compile(r'\b(OE|Ref|Similar|sim\.?)\b|^\s*[\d .]{6,}$',re.I)
def txt(el): return re.sub(r'\s+',' ',el.get_text(' ')).strip()
BRAND={'agricultural-applications-agco-massey-ferguson':'AGCO / Massey Ferguson','agricultural-applications-fnh-group':'New Holland (FNH)','agricultural-applications-case':'Case IH','agricultural-applications-john-deere':'John Deere'}
GUIDES=[
 ('auto-europe','Auto Europe','Car and van radiator caps by manufacturer.'),
 ('radiator-caps-japanese-vehicle-applications','Japanese Vehicle Applications','Radiator caps for Japanese cars and vans.'),
 ('radiator-caps-trucks-commercial','Trucks & Commercial','Pressure caps, oil filler covers and fuel tank covers for trucks and commercial vehicles.'),
 ('other-applications','Other Applications','Caps for compressors, industrial and other applications.'),
 ('agricultural-applications-agco-massey-ferguson','Agricultural: AGCO (Massey Ferguson)',''),
 ('agricultural-applications-fnh-group','Agricultural: FNH Group',''),
 ('agricultural-applications-case','Agricultural: CASE',''),
 ('agricultural-applications-john-deere','Agricultural: John Deere',''),
 ('agricultural-applications-other','Agricultural: Other',''),
]
def heading_for(tb):
    # bold/strong text in the cell that contains this table, before the table
    host=tb.find_parent('td')
    for el in (tb.find_all_previous(['b','strong','h2','h3','h4'],limit=6)):
        t=txt(el)
        if t and not CODE.match(t) and not PRESSURE.search(t) and len(t)<60 and (host is None or host in el.parents or True):
            return t
    return None
out=[]; stats={'parts':0,'matched':0}
for slug,title,intro in GUIDES:
    soup=BeautifulSoup(open(f'{D}/wppages/{slug}.html').read(),'html.parser')
    sections=[]; last_heading=None
    for tb in [t for t in soup.find_all('table') if not t.find('table')]:
        rows=[[ (txt(td), bool(td.find('img'))) for td in tr.find_all(['td','th'])] for tr in tb.find_all('tr')]
        h=heading_for(tb)
        parts=[]; cols=None; label=[]
        for cells in rows:
            texts=[c[0] for c in cells]
            nonempty=[x for x in texts if x]
            if nonempty and sum(bool(CODE.match(x)) for x in nonempty)>=max(1,len(nonempty)*0.6):
                cols=[]
                for i,x in enumerate(texts):
                    m=CODE.match(x)
                    if not m: cols.append(None); continue
                    code=re.sub(r'\s+','',m.group(0)).upper(); rest=x[m.end():].strip(' -–()')
                    part={'code':code,'details':[rest] if rest else [], 'label': label[i] if i<len(label) else ''}
                    parts.append(part); cols.append(part)
                label=[]
            elif cols is None:
                label=texts  # header labels above the code row (e.g. "Short Reach Wing Caps")
            else:
                for i,x in enumerate(texts):
                    if x and i<len(cols) and cols[i] is not None: cols[i]['details'].append(x)
        if not parts: continue
        sec_parts=[]
        for p in parts:
            pressure=next((d for d in p['details'] if PRESSURE.search(d) and len(d)<40),None)
            oe=[d for d in p['details'] if d!=pressure and OE.search(d)]
            fits=[d for d in p['details'] if d!=pressure and d not in oe]
            ids=by_code.get(norm(p['code']),[])
            stats['parts']+=1; stats['matched']+=bool(ids)
            sec_parts.append({'code':p['code'],'productIds':ids,'pressure':pressure,'fits':'; '.join(fits) or p['label'] or None,'oe':'; '.join(oe) or None})
        hh=re.sub(r'^[-–\s]+|[:\s]+$','',h or '').strip() or None
        if hh and hh.lower() in ('description',): hh=None
        if sections and (sections[-1]['heading'] or '').lower()==(hh or '').lower(): sections[-1]['parts']+=sec_parts
        else: sections.append({'heading':hh,'parts':sec_parts})
    out.append({'slug':slug,'title':title,'intro':intro,'sections':sections})
# vehicle labels for product pages
apps={}
MAKES=r'(Alfa Romeo|Alpha Romeo|Audi|BMW|Citroen|Fiat|Ford|Lancia|Land Rover|Mercedes|Mini|Opel|Vauxhall|Peugeot|Renault|Rover|Saab|Seat|Skoda|Volvo|VW|Volkswagen|Scania|DAF|Iveco|MAN|Mazda|Kia|Nissan|Toyota|Honda|Deutz|Fendt|Jaguar)'
for g in out:
    for sec in g['sections']:
        for p in sec['parts']:
            label=None
            if g['slug'] in BRAND: label=BRAND[g['slug']]
            elif g['slug']=='agricultural-applications-other' and sec['heading'] and sec['heading'].isupper(): label=sec['heading'].title()
            elif g['slug']=='auto-europe' and sec['heading']:
                make={'Alpha Romeo':'Alfa Romeo','Landrover':'Land Rover','Volkswagon':'Volkswagen'}.get(sec['heading'],sec['heading'])
                fits=(p['fits'] or '')
                fits=re.sub(r'(?i)^'+re.escape(make.split()[0])+r'\s*:?\s*','',fits).strip(' ;,')
                # model lists only; drop fits that are just part/OE numbers
                if not re.search(r'[A-Za-z]{2,}',re.sub(CODE.pattern,'',fits,flags=re.I)) and not re.search(r'\b[A-Z]?\d{1,3}[a-z]?\b',fits) or re.search(r'\d{5,}',fits) or CODE.search(fits): fits=''
                label=(make+(': '+fits if fits else ''))[:120]
            elif p['fits']:
                m=re.match(MAKES,p['fits'],re.I)
                if m: label=m.group(1).title().replace('Bmw','BMW').replace('Vw','VW')
            if label:
                p['vehicle']=label
                for pid in p['productIds']: apps.setdefault(pid,[]); label not in apps[pid] and apps[pid].append(label)
json.dump(apps,open(f'{D}/product_apps.json','w'),indent=1)
print('products getting vehicle labels:',len(apps))
json.dump(out,open(f'{D}/applications.json','w'),indent=1)
print(stats)
for g in out: print(g['slug'], len(g['sections']), sum(len(s['parts']) for s in g['sections']), [s['heading'] for s in g['sections']][:8])
