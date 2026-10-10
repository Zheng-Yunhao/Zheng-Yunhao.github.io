/* Presentation only: publication content continues to come from the managed Jekyll page. */
(()=>{
  'use strict';
  const root=document.documentElement;
  const themeButton=document.querySelector('.theme-toggle');
  const themeLabel=()=>{if(themeButton)themeButton.setAttribute('aria-label',`Switch to ${root.dataset.theme==='dark'?'light':'dark'} mode`);};
  themeLabel();
  themeButton?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('yz-research-theme',root.dataset.theme);}catch(e){}themeLabel();});
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-navigation');
  if(menu&&nav){
    root.classList.add('navigation-enhanced');
    const closeMenu=()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
    menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
    nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
    document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
  }
  document.querySelectorAll('.publications-content').forEach(container=>{
    let number=0;
    container.querySelectorAll('li').forEach(li=>{
      const citation=li.querySelector(':scope > p')||li,title=citation.querySelector('strong'),journal=citation.querySelector('em'),links=[...citation.querySelectorAll('a')];
      if(!title||!journal||!links.length)return;
      const original=citation.textContent;
      const authorsRange=document.createRange();authorsRange.setStart(citation,0);authorsRange.setEndBefore(title);const authorsFragment=authorsRange.cloneContents();
      const year=(authorsFragment.textContent.match(/\((\d{4}|n\.d\.)\)\.\s*$/)||[])[1]||'';
      const walker=document.createTreeWalker(authorsFragment,NodeFilter.SHOW_TEXT);let lastText;while(walker.nextNode())lastText=walker.currentNode;
      if(lastText)lastText.textContent=lastText.textContent.replace(/\s*\((\d{4}|n\.d\.)\)\.\s*$/,'');
      const metaRange=document.createRange();metaRange.setStartAfter(title);metaRange.setEndBefore(links[0]);const metaFragment=metaRange.cloneContents();
      const titleText=title.textContent;
      let collection='selected';let previous=li.closest('ul').previousElementSibling;
      while(previous){if(previous.matches('h2')){collection=previous.textContent.includes('Other')?'other':'selected';break;}previous=previous.previousElementSibling;}
      li.replaceChildren();li.classList.add('publication-card');li.dataset.collection=collection;li.dataset.year=year;li.dataset.search=(original+' '+links.map(a=>a.href).join(' ')).toLocaleLowerCase();
      const index=document.createElement('span');index.className='paper-number';index.setAttribute('aria-hidden','true');index.textContent=String(++number).padStart(2,'0');
      const body=document.createElement('div');body.className='paper-body';
      const heading=document.createElement('h3');heading.className='paper-title';heading.textContent=titleText;
      const authors=document.createElement('p');authors.className='paper-authors';authors.append(authorsFragment);
      const meta=document.createElement('p');meta.className='paper-meta';if(year){const badge=document.createElement('span');badge.className='paper-year';badge.textContent=year+' · ';meta.append(badge);}meta.append(metaFragment);
      const actions=document.createElement('div');actions.className='paper-actions';
      links.forEach(a=>{const label=a.textContent.replace(/[\[\]]/g,'').trim();a.dataset.linkKind=label;a.textContent=label==='Paper'?'DOI':label;actions.append(a);});
      body.append(heading,authors,meta,actions);li.append(index,body);
    });
  });
  const publicationRoot=document.querySelector('.publications-page .publications-content');
  if(publicationRoot){
    const toolbar=document.querySelector('.publication-toolbar'),search=document.querySelector('#publication-search'),yearSelect=document.querySelector('#publication-year'),cards=[...publicationRoot.querySelectorAll('.publication-card')],count=document.querySelector('.search-count'),empty=document.querySelector('.no-results');
    if(toolbar&&search&&yearSelect&&cards.length){
      [...new Set(cards.map(c=>c.dataset.year).filter(y=>/^\d{4}$/.test(y)))].sort((a,b)=>b-a).forEach(year=>{const option=document.createElement('option');option.value=option.textContent=year;yearSelect.append(option);});
      let collection='all';
      const filter=()=>{
        const words=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let visible=0;
        cards.forEach(card=>{const match=(collection==='all'||card.dataset.collection===collection)&&(!yearSelect.value||card.dataset.year===yearSelect.value)&&words.every(word=>card.dataset.search.includes(word));card.hidden=!match;if(match)visible++;});
        publicationRoot.querySelectorAll(':scope > h2, :scope > h3').forEach(heading=>{let found=false,next=heading.nextElementSibling;while(next&&!next.matches(heading.matches('h2')?'h2':'h2,h3')){if(next.matches('ul')&&next.querySelector('.publication-card:not([hidden])'))found=true;next=next.nextElementSibling;}heading.hidden=!found;});
        publicationRoot.querySelectorAll(':scope > ul').forEach(list=>{list.hidden=!list.querySelector('.publication-card:not([hidden])');});
        count.textContent=`${visible} ${visible===1?'publication':'publications'}${visible===cards.length?'':' of '+cards.length}`;empty.hidden=visible>0;
      };
      toolbar.hidden=false;search.addEventListener('input',filter);yearSelect.addEventListener('change',filter);
      toolbar.querySelectorAll('[data-collection]').forEach(button=>button.addEventListener('click',()=>{collection=button.dataset.collection;toolbar.querySelectorAll('[data-collection]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));filter();
    }
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.home-page .section-heading,.research-card,.toolkit-feature,.contact-section').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});}
  const visual=document.querySelector('.hero-visual'),portrait=document.querySelector('.portrait-card');
  if(visual&&portrait&&!reduced&&matchMedia('(hover: hover) and (pointer: fine)').matches){let frame;visual.addEventListener('pointermove',e=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const rect=visual.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;portrait.style.transform=`rotate(-3deg) rotateY(${x*9}deg) rotateX(${-y*7}deg)`;});});visual.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);portrait.style.transform='rotate(-3deg)';});}
})();
