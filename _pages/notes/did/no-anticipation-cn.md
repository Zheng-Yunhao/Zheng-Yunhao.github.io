---
title: "DiD 的无预期假设"
layout: single
permalink: /notes/did/no-anticipation/
author_profile: false
sitemap: false
noindex: true
---

{% include toc title="目录" %}

双重差分 (difference-in-differences, DiD) 最核心的两个识别假设是**平行趋势假设 (parallel-trends assumption, PT)** 和**无预期假设 (no-anticipation assumption, NA)**. 平行趋势负责识别未处理结局的变化, 无预期负责保证处理前观测结局仍然是未处理结局. 简单说:

> 平行趋势提供趋势, 无预期提供基线.

本笔记讨论四个问题:

1. 无预期本质上限制什么, 应该如何理解这一限制.
2. 无预期与非随机处理分配是什么关系.
3. 无预期被违背后, DiD 估计量会受到什么污染.
4. 如何从提前反应的时间范围, 大小和时间形状三个方向放宽标准无预期.

对平行趋势假设的讨论参考笔记: [DiD 的平行趋势假设](/notes/did/parallel-trends/).

---

## 1. 基本设定和识别逻辑

### 1.1 交错实施设定 (staggered-adoption setting)

考虑交错实施. 以下路径记号沿用 Roth 等 (2023). 令时期为

$$
t=1,\ldots,T,
$$

并令 $D_{i,t}$ 表示单位 $i$ 在时期 $t$ 是否已经接受处理. 假设处理一旦开始便持续存在, 即处理状态为**吸收态 (absorbing state)**. 定义首次处理时间 (first-treatment time)

$$
G_i=\min\{t:D_{i,t}=1\}.
$$

若单位在样本期内从未接受处理, 记为

$$
G_i=\infty.
$$

从时期 $g$ 开始处理所对应的处理路径 (treatment path) 为

$$
\boldsymbol d^{(g)}
=
(\mathbf 0_{g-1},\mathbf 1_{T-g+1}),
$$

从未处理路径 (never-treated path) 为

$$
\boldsymbol d^{(\infty)}
=
\mathbf 0_T.
$$

令潜在结局

$$
Y_{i,t}(g)
=
Y_{i,t}\!\left(\boldsymbol d^{(g)}\right)
$$

表示单位 $i$ 在从时期 $g$ 开始处理时, 于时期 $t$ 的潜在结局. 相应地,

$$
Y_{i,t}(\infty)
=
Y_{i,t}\!\left(\mathbf 0_T\right)
$$

表示该单位在始终不接受处理时的潜在结局.

### 1.2 DiD 为什么需要无预期

对实际在时期 $g$ 开始处理的处理队列 (treatment cohort), 我们希望识别**组别-时期处理组平均处理效应 (group-time average treatment effect on the treated, $ATT(g,t)$)**:

$$
ATT(g,t)
=
\mathbb E\!\left[
Y_{i,t}(g)-Y_{i,t}(\infty)
\mid G_i=g
\right],
\qquad t\ge g.
$$

真正缺失的反事实量 (counterfactual quantity) 是

$$
\mathbb E\!\left[
Y_{i,t}(\infty)
\mid G_i=g
\right].
$$

选取一个处理前基线期 (reference period) $s<g$, 有

$$
\mathbb E\!\left[
Y_{i,t}(\infty)
\mid G_i=g
\right]
=
{\color{red}\mathbb E\!\left[
Y_{i,s}(\infty)
\mid G_i=g
\right]}
+
{\color{blue}\mathbb E\!\left[
Y_{i,t}(\infty)-Y_{i,s}(\infty)
\mid G_i=g
\right]}.
$$

这两个部分由两个不同假设识别:

1. 无预期结合**一致性假设 (consistency assumption)**, 将第一项识别为处理组在基线期的观测均值:

   $$
   \color{red} \mathbb E\!\left[
   Y_{i,s}(\infty)
   \mid G_i=g
   \right]
   =
   \mathbb E\!\left[
   Y_{i,s}
   \mid G_i=g
   \right].
   $$

2. 平行趋势将第二项搬运到某个有效比较队列 (comparison cohort) $c$:

   $$
   \color{blue}\mathbb E\!\left[
   Y_{i,t}(\infty)-Y_{i,s}(\infty)
   \mid G_i=g
   \right]
   =
   \mathbb E\!\left[
   Y_{i,t}(\infty)-Y_{i,s}(\infty)
   \mid G_i=c
   \right].
   $$

若比较队列**在 $s$ 和 $t$ 都没有受到处理或预期效应 (anticipation effect) 污染**, 则右侧进一步等于

$$
\color{blue} \mathbb E\!\left[
Y_{i,t}-Y_{i,s}
\mid G_i=c
\right].
$$

于是

$$
\mathbb E\!\left[
Y_{i,t}(\infty)
\mid G_i=g
\right]
=
{\color{red}\mathbb E\!\left[
Y_{i,s}
\mid G_i=g
\right]}
+
{\color{blue}\mathbb E\!\left[
Y_{i,t}-Y_{i,s}
\mid G_i=c
\right]}.
$$

因此, DiD 的识别逻辑不是只依赖平行趋势. 即使未处理趋势可以从对照组搬运过来, 我们仍然需要一个没有被预期效应污染的处理组基线.

---

## 2. 无预期假设的正式定义

### 2.1 个体层面的无预期

标准个体层面无预期要求

$$
Y_{i,t}(g)
=
Y_{i,t}(\infty),
\qquad t<g.
\tag{NA}
$$

它的含义是: 只要时期 $t$ 早于正式处理时点 $g$, 单位在时期 $t$ 的潜在结局就不能因为未来将在 $g$ 时点接受处理而发生变化.

这个定义比较的是同一个单位在两条不同未来处理路径下的当前潜在结局. 两条路径在时期 $t$ 之前完全相同, 唯一差异发生在未来.

### 2.2 分布层面和均值层面的无预期

个体层面等式很强. 若研究目标只是识别 $ATT(g,t)$, 通常只需要更弱的队列条件均值版本:

$$
\mathbb E\!\left[
Y_{i,t}(g)-Y_{i,t}(\infty)
\mid G_i=g
\right]
=
0,
\qquad t<g.
\tag{均值无预期}
$$

还可以定义介于二者之间的分布层面版本:

$$
\mathcal L\!\left[
Y_{i,t}(g)
\mid G_i=g
\right]
=
\mathcal L\!\left[
Y_{i,t}(\infty)
\mid G_i=g
\right],
\qquad t<g.
$$

在相应矩存在时, 三个版本满足

$$
\text{个体无预期}
\Longrightarrow
\text{分布无预期}
\Longrightarrow
\text{均值无预期}.
$$

因此, 具体需要哪个版本取决于目标参数. 识别均值效应通常只需要均值无预期. 识别分位数, 分布效应或其他非均值目标时, 则可能需要更强的分布限制.

### 2.3 两期两组设计 (two-group two-period design, $2\times2$ design) 是特例

两期两组设计可以直接嵌入上述记号. 若处理组在第 2 期开始处理, 则 $g=2$, 无预期写成

$$
Y_{i,1}(2)
=
Y_{i,1}(\infty).
$$

用完整路径写就是

$$
Y_{i,1}(0,1)
=
Y_{i,1}(0,0).
$$

这里的 $Y_{i,1}(0,1)$ 不是指单位在第 1 期接受处理时的结局. 它表示单位第 1 期尚未处理, 但第 2 期将接受处理时, 第 1 期的潜在结局.

使用完整路径记号可以避免把未来处理状态误读为当前处理状态.

---

## 3. 无预期本质上限制什么

### 3.1 无预期是对潜在结局表的跨世界限制 (cross-world restriction)

无预期首先不是一个处理分配条件, 而是一个对潜在结局表 (potential-outcome schedule) 的结构限制. 它要求

$$
Y_{i,t}(g)
=
Y_{i,t}(\infty),
\qquad t<g,
$$

也就是把同一个单位在两个互不相容世界中的潜在结局设为相等:

1. 世界一: 单位在时期 $g$ 开始处理.
2. 世界二: 单位始终不接受处理.

因此, 无预期是一个跨世界限制. 

>  跨世界假设一般认为是强假设, 例如个体处理效应 (individual treatment effect, ITE) $Y_i(1)-Y_i(0)$ 这样的跨世界差值一般认为是几乎不可能得到的. 但是无预期假设是个例外, 类似的例外还有工具变量方法中的无违背者假设 (no-defiers assumption).

实践中, 需要判断的是具体机制是否支持该限制. 若单位在处理前不知道未来处理安排, 也不会因未来安排改变当前行为, 无预期通常具有直接的时间顺序解释. 若政策已经公告, 资格已经确定, 或市场已经提前反应, 无预期便可能不成立.

### 3.2 无预期等价于未来处理时点不变性 (invariance to future treatment timing)

对任意 $g,g'>t$, 其中允许 $g'=\infty$, 无预期等价于

$$
Y_{i,t}(g)
=
Y_{i,t}(g').
\tag{未来处理时点不变性}
$$

因为

$$
Y_{i,t}(g)
=
Y_{i,t}(\infty)
=
Y_{i,t}(g').
$$

这个形式更直接地说明了无预期的核心:

> 在时期 $t$ 看, 只要所有候选路径都要到未来才开始处理, 未来具体在哪一期开始处理不应改变时期 $t$ 的结局.

例如,

$$
Y_{i,2}(4)
=
Y_{i,2}(5)
=
Y_{i,2}(6)
=
Y_{i,2}(\infty).
$$

### 3.3 无预期等价于处理前路径效应 (pre-treatment path effect) 为零

定义单位层面的路径效应

$$
\tau_{i,t}(g)
=
Y_{i,t}(g)-Y_{i,t}(\infty).
$$

那么

$$
\text{NA}
\iff
\tau_{i,t}(g)=0,
\qquad t<g.
\tag{处理前路径效应为零}
$$

再定义队列 $g$ 的平均预期效应 (average anticipation effect)

$$
A_t(g)
=
\mathbb E\!\left[
Y_{i,t}(g)-Y_{i,t}(\infty)
\mid G_i=g
\right],
\qquad t<g.
$$

均值无预期就是

$$
A_t(g)=0,
\qquad t<g.
$$

这个形式最适合讨论无预期的违背. 一旦无预期不成立, 问题就不再是一个简单的是或否判断, 而是处理前预期路径 $A_t(g)$ 从什么时候开始出现, 有多大, 以及具有怎样的时间形状.

### 3.4 无预期结合一致性后给出干净基线 

若单位实际属于队列 $g$, 一致性给出

$$
Y_{i,t}
=
Y_{i,t}(g).
$$

若个体无预期成立, 则对 $t<g$,

$$
Y_{i,t}
=
Y_{i,t}(g)
=
Y_{i,t}(\infty).
\tag{干净基线}
$$

若只假设均值无预期, 则得到相应的均值等式:

$$
\mathbb E\!\left[
Y_{i,t}
\mid G_i=g
\right]
=
\mathbb E\!\left[
Y_{i,t}(\infty)
\mid G_i=g
\right],
\qquad t<g.
$$

这就是干净基线. 因此, 从 DiD 识别角度看, 无预期最重要的作用可以概括为:

> 无预期保证处理组的**处理前观测结局**可以作为**未处理反事实**的基线.

---

## 4. 无预期与非随机处理分配完全不同

### 4.1 无预期不是统计独立性

一种常见但是极具**歧义**的简化口语表述是:

> 无预期意味着当前潜在结局与未来处理无关.

这句话中的无关具有歧义. 若把它理解为统计独立性, 就会错误地写成

$$
Y_{i,t}(\infty)
\perp\!\!\!\perp
G_i.
$$

DiD 从不要求这一条件. 处理时间完全可以与未处理潜在结局高度相关. 例如, 基线结局更高的单位可能更早接受处理, 即

$$
Y_{i,t}(\infty)
\not\!\perp\!\!\!\perp
G_i.
$$

这与无预期可以同时成立.

事实上, 无预期和随机处理分配的比较的对象完全不同:

1. 无预期比较同一个单位在不同未来处理路径下的当前潜在结局:

   $$
   Y_{i,t}(g)
   \quad\text{与}\quad
   Y_{i,t}(\infty).
   $$

2. 统计独立性比较不同处理队列中的未处理潜在结局分布:

   $$
   \mathcal L\!\left[
   Y_{i,t}(\infty)
   \mid G_i=g
   \right]
   \quad\text{与}\quad
   \mathcal L\!\left[
   Y_{i,t}(\infty)
   \mid G_i=c
   \right].
   $$

因此, 对无预期最准确的表述是反事实不变性 (counterfactual invariance): **只改变未来何时开始处理, 不能反过来改变处理前的当前结局**.

### 4.2 无预期, 选择偏倚和平行趋势属于三个不同层次

可以把 DiD 的逻辑分成三个层次:

1. 路径效应结构: 不同处理路径如何改变同一单位的潜在结局. 无预期属于这一层.
2. 处理分配机制 (treatment-assignment mechanism): 什么样的单位在什么时候接受处理. 选择偏倚 (selection bias) 属于这一层.
3. 未处理趋势可比性: 不同队列的未处理潜在结局如何随时间变化. 平行趋势属于这一层.

DiD 允许未处理结局水平不同:

$$
\mathbb E\!\left[
Y_{i,s}(\infty)
\mid G_i=g
\right]
\ne
\mathbb E\!\left[
Y_{i,s}(\infty)
\mid G_i=c
\right],
$$

只要求其变化在相应比较中相同:

$$
\mathbb E\!\left[
Y_{i,t}(\infty)-Y_{i,s}(\infty)
\mid G_i=g
\right]
=
\mathbb E\!\left[
Y_{i,t}(\infty)-Y_{i,s}(\infty)
\mid G_i=c
\right].
$$

因此, 非随机处理分配不是 DiD 的例外, 而是 DiD 试图处理的基本场景.

### 4.3 预期效应不是未来穿越到过去

预期效应通常写成

$$
Y_{i,t}(g)
\neq
Y_{i,t}(\infty),
\qquad t<g.
$$

字面上看, 这似乎是未来实施的处理影响了过去. 现实中的机制通常不是时间倒流, 而是

$$
\text{公告, 信息或预期}
\longrightarrow
\text{处理前行为变化}
\longrightarrow
Y_{i,t}.
$$

例如, 政策在 2025 年公告, 在 2026 年正式实施. 2025 年的行为变化来自政策信息, 而不是 2026 年的实施本身.

标准记号 $Y_{i,t}(g)$ 通常把实施时点及其伴随的信息环境共同编码进路径 $g$. 若公告时间本身也是需要区分的干预组成部分, 更严格的记号应同时索引实施时间 (implementation time) $g$ 和公告时间 (announcement time) $a$:

$$
Y_{i,t}(g,a).
$$

这时, 所谓预期效应可以被重新表述为公告路径或信息路径 (information path) 在正式处理前已经产生了因果作用.

---

## 5. 放宽无预期假设: 有限预期假设

标准无预期要求

$$
A_t(g)=0,
\qquad t<g.
$$

Callaway 和 Sant'Anna (2021) 考虑**有限预期假设 (limited-anticipation assumption)**. 给定一个非负整数 $\delta$, 均值层面的有限预期写成

$$
A_t(g)=0,
\qquad t<g-\delta.
\tag{有限预期}
$$

相应的个体层面版本为

$$
Y_{i,t}(g)
=
Y_{i,t}(\infty),
\qquad t<g-\delta.
$$

当 $\delta=0$ 时, 它退化为标准无预期. 当 $\delta>0$ 时, 允许

$$
t=g-\delta,\ldots,g-1
$$

受到预期效应影响.

例如, 若 $g=5$ 且 $\delta=2$, 则时期 3 和 4 可以受到预期效应影响, 但时期 1 和 2 必须保持为零.

### 5.1 第一层作用: 支集限制 (support restriction)

支集限制回答的是:

> 预期效应最早可以从什么时候开始?

有限预期允许预期效应存在, 但要求非零预期效应只能出现在正式处理前的预期窗口 (anticipation window) 内. 这个窗口为

$$
\{g-\delta,\ldots,g-1\}.
$$

### 5.2 第二层作用: 提供零锚点 (zero anchor)

有限预期更重要的识别作用是提供零锚点:

$$
A_t(g)=0,
\qquad t<g-\delta.
$$

因此, 任意满足

$$
s<g-\delta
$$

的时期都可以作为未被预期效应污染的基线期. 在整数时间下, 最晚的保证干净基线期是

$$
s=g-\delta-1.
$$

所以, 有限预期在保留预期效应的同时, 告诉我们预期路径在什么位置仍然被锚定为零. 因此允许有限预期后, 基线期必须向前移动. 若 $\delta\ge1$, 通常使用的 $g-1$ 不再是保证干净的基线. 若样本中不存在任何满足 $s<g-\delta$ 的处理前时期, 那么仅依赖有限预期无法提供零锚点. 此时, 标准点识别 (point identification) 通常需要额外结构.

### 5.3 第三层作用: 改变对照组资格

若一个比较队列在时期 $c$ 才正式接受处理, 但可能提前 $\delta$ 期反应, 那么它从时期 $c-\delta$ 开始便不再是保证干净的未处理对照组.

在时期 $t$ 使用尚未处理队列 (not-yet-treated cohort) 作为对照组时, 仅有

$$
D_{i,t}=0
$$

并不够. 还需要

$$
t<c-\delta,
$$

等价地,

$$
c>t+\delta.
$$

因此, 有限预期同时改变两件事:

1. 处理组可以使用哪个基线.
2. 哪些尚未处理队列仍有资格作为对照组.

---

## 6. 对无预期的三类放宽

定义平均预期效应路径

$$
A_t(g)
=
\mathbb E\!\left[
Y_{i,t}(g)-Y_{i,t}(\infty)
\mid G_i=g
\right],
\qquad t<g.
$$

标准均值无预期要求整条处理前路径恒为零:

$$
A_t(g)=0,
\qquad t<g.
$$

对这一条件的放宽可以按三个不同维度组织. 三类限制不是互斥的, 可以组合使用.

### 6.1 支集限制: 有限预期

有限预期要求

$$
A_t(g)=0,
\qquad t<g-\delta.
$$

它限制预期效应在什么时候可以出现, 并提供至少一个已知为零的区间.

### 6.2 大小限制: 有界预期 (bounded anticipation)

有界预期不要求任何时期的预期效应严格为零, 而是假设

$$
|A_t(g)|
\le
\Gamma_{g,t}.
\tag{有界预期}
$$

它回答的是:

> 预期效应最多可以有多大?

在平行趋势成立且对照组干净时, 后文将得到

$$
\operatorname{DiD}(g,t;s,c)
=
ATT(g,t)-A_s(g).
$$

因此, 若仅知道

$$
|A_s(g)|
\le
\Gamma_{g,s},
$$

便可以得到

$$
ATT(g,t)
\in
\left[
\operatorname{DiD}(g,t;s,c)-\Gamma_{g,s},
\operatorname{DiD}(g,t;s,c)+\Gamma_{g,s}
\right].
$$

此时得到的是部分识别 (partial identification), 而不是点识别.

### 6.3 形状限制 (shape restriction): 单调预期 (monotone anticipation)

若我们相信正式处理越接近, 正向预期效应越强, 可以假设

$$
0
\le
A_t(g)
\le
A_{t+1}(g),
\qquad t<g-1.
$$

若预期效应为负, 并且随着正式处理接近而变得更强, 可以假设

$$
0
\ge
A_t(g)
\ge
A_{t+1}(g),
\qquad t<g-1.
$$

在预期效应不变号的前提下, 可以统一写成

$$
|A_t(g)|
\le
|A_{t+1}(g)|,
\qquad t<g-1.
\tag{单调预期}
$$

单调预期提供的是顺序信息, 而不是水平信息. 它告诉我们哪个时期的预期效应更强, 但并不自动告诉我们任何一个时期的预期效应等于零.

---

## 7. 无预期, 平行趋势和处理前趋势 (pre-treatment trend, pre-trend)

处理前趋势是理解无预期违背的关键, 但它不是无预期的直接检验.

### 7.1 单个队列的处理前趋势分解

令

$$
s<t<g.
$$

定义队列 $g$ 的观测处理前变化

$$
\Delta^{\mathrm{obs}}_{g;s,t}
=
\mathbb E\!\left[
Y_{i,t}-Y_{i,s}
\mid G_i=g
\right],
$$

以及对应的未处理潜在结局变化

$$
\Delta^{\infty}_{g;s,t}
=
\mathbb E\!\left[
Y_{i,t}(\infty)-Y_{i,s}(\infty)
\mid G_i=g
\right].
$$

由一致性,

$$
\boxed{
\Delta^{\mathrm{obs}}_{g;s,t}
=
\Delta^{\infty}_{g;s,t}
+
\left\{
A_t(g)-A_s(g)
\right\}.
}
\tag{单队列处理前趋势分解}
$$

这个分解不需要无预期. 它说明观测到的处理前变化由两部分组成:

1. 该队列本来就会发生的未处理结局变化.
2. 预期效应在 $s$ 到 $t$ 之间的变化.

### 7.2 两个队列的相对处理前趋势分解

再考虑另一个队列 $c$, 并假设

$$
s<t<\min(g,c).
$$

两个队列的相对处理前趋势满足

$$
\boxed{
\begin{aligned}
&
\Delta^{\mathrm{obs}}_{g;s,t}
-
\Delta^{\mathrm{obs}}_{c;s,t}
\\
={}&
\underbrace{
\left\{
\Delta^{\infty}_{g;s,t}
-
\Delta^{\infty}_{c;s,t}
\right\}
}_{\text{未处理趋势差异}}
\\
&+
\underbrace{
\left[
\left\{
A_t(g)-A_s(g)
\right\}
-
\left\{
A_t(c)-A_s(c)
\right\}
\right]
}_{\text{预期效应变化差异}}.
\end{aligned}
}
\tag{相对处理前趋势分解}
$$

因此, 观测到的相对处理前趋势同时混合了两类信息:

1. 未处理潜在结局是否具有相同趋势.
2. 两个队列的预期效应是否以相同方式变化.

### 7.3 非零处理前趋势差异不等于无预期被违背

若两个队列的观测处理前趋势不同, 可能有三种原因:

1. 未处理趋势不平行.
2. 预期效应随时间变化.
3. 二者同时存在.

因此,

$$
\boxed{
\text{处理前趋势差异}
\not\Rightarrow
\text{无预期违背}.
}
$$

更准确地说, 非零处理前趋势差异只能说明一组联合限制被违背, 不能单独定位是平行趋势失败还是无预期失败.

### 7.4 平坦处理前趋势也不等于无预期成立

假设未处理趋势平行, 比较队列没有预期效应, 但队列 $g$ 在所有可观测处理前时期都满足

$$
A_t(g)
=
a_0
\ne
0.
$$

那么任意 $s<t<g$ 都有

$$
A_t(g)-A_s(g)
=
0.
$$

于是相对处理前趋势完全平坦, 但无预期已经被违背.

更一般地, 未处理趋势偏离与预期效应变化还可能彼此抵消. 所以, 即使预期效应正在变化, 观测处理前趋势也可能看起来平坦.

---

## 8. 无预期违背如何污染 DiD 估计量

### 8.1 DiD 偏差分解

考虑处理队列 $g$, 处理后时期 $t\ge g$, 基线期 $s<g$, 以及一个在时期 $t$ 仍未正式处理的比较队列 $c>t$. 定义组别-时期 DiD 对比

$$
\operatorname{DiD}(g,t;s,c)
=
\left\{
\mathbb E\!\left[
Y_{i,t}-Y_{i,s}
\mid G_i=g
\right]
\right\}
-
\left\{
\mathbb E\!\left[
Y_{i,t}-Y_{i,s}
\mid G_i=c
\right]
\right\}.
$$

定义平行趋势偏离项 (parallel-trends deviation)

$$
B^{\mathrm{PT}}_{g,c;s,t}
=
\mathbb E\!\left[
Y_{i,t}(\infty)-Y_{i,s}(\infty)
\mid G_i=g
\right]
-
\mathbb E\!\left[
Y_{i,t}(\infty)-Y_{i,s}(\infty)
\mid G_i=c
\right].
$$

由一致性和代数分解可得

$$
\boxed{
\begin{aligned}
\operatorname{DiD}(g,t;s,c)
={}&
ATT(g,t)
-A_s(g)
+B^{\mathrm{PT}}_{g,c;s,t}
\\
&-
\left\{
A_t(c)-A_s(c)
\right\}.
\end{aligned}
}
\tag{DiD 偏差分解}
$$

四个部分分别是:

1. 目标效应 $ATT(g,t)$.
2. 处理组基线期的预期效应污染 $-A_s(g)$.
3. 未处理趋势不平行造成的偏离 $B^{\mathrm{PT}}_{g,c;s,t}$.
4. 尚未处理对照组在 $s$ 到 $t$ 之间的预期效应变化污染.

这个分解说明, 尚未正式处理不等于可以安全地作为对照组. 若队列 $c$ 已经进入预期窗口, 它的观测趋势也会被污染.

### 8.2 干净对照组和平行趋势下的简化

若平行趋势成立,

$$
B^{\mathrm{PT}}_{g,c;s,t}
=
0,
$$

并且比较队列在 $s$ 和 $t$ 都是干净的,

$$
A_s(c)
=
A_t(c)
=
0,
$$

则

$$
\boxed{
\operatorname{DiD}(g,t;s,c)
=
ATT(g,t)-A_s(g).
}
\tag{基线期污染公式}
$$

因此, 相对于 $ATT(g,t)$ 的偏差为 $-A_s(g)$, 若 $A_s(g)>0$, DiD 会低估时期 $t$ 的处理效应. 若 $A_s(g)<0$, DiD 会高估处理效应.

对同一个队列而言, 使用同一个受污染基线期估计多个处理后时期时, 整条处理后动态效应路径都会被同一个 $-A_s(g)$ 平移.

### 8.3 两期两组设计是一般公式的特例

在两期两组设计中, 令处理队列在第 2 期开始处理, 即

$$
g=t=2,
\qquad s=1,
$$

并使用从未处理组 (never-treated group) 作为对照组. 则

$$
\boxed{
\operatorname{DiD}
=
ATT(2,2)-A_1(2).
}
$$

其中

$$
A_1(2)
=
\mathbb E\!\left[
Y_{i,1}(2)-Y_{i,1}(\infty)
\mid G_i=2
\right].
$$

这就是标准两期两组偏倚公式. 若处理组在第 1 期已经因为未来处理而发生正向反应, DiD 会把这部分提前发生的效应从第 2 期效应中减掉.

### 8.4 有限预期如何恢复识别

若有限预期成立, 选择

$$
s<g-\delta
$$

即可保证

$$
A_s(g)=0.
$$

若比较队列满足

$$
c>t+\delta,
$$

则它在 $s$ 和 $t$ 都尚未进入预期窗口, 因而

$$
A_s(c)
=
A_t(c)
=
0.
$$

再结合平行趋势,

$$
\operatorname{DiD}(g,t;s,c)
=
ATT(g,t).
$$

因此, 有限预期同时重新定义了有效基线期和有效对照组.

---

## 9. 实践中的直接含义

### 9.1 先区分公告时点和实施时点

研究设计不能只记录政策何时正式生效. 还需要判断单位从什么时候开始知道政策, 什么时候确定资格, 什么时候能够提前调整行为.

若公告早于实施, 公告时点通常比正式实施时点更接近预期窗口的起点.

### 9.2 基线期不能机械地选择为 $g-1$

若存在提前 $\delta$ 期反应的可能, 最晚保证干净的基线期是

$$
g-\delta-1.
$$

使用 $g-1$ 作为基线期, 实际上隐含了 $\delta=0$.

### 9.3 尚未处理组不一定是有效对照组

使用尚未处理队列时, 应根据

$$
c>t+\delta
$$

重新构造对照组风险集, 而不是只检查 $c>t$.

### 9.4 平坦处理前趋势不能被表述为证明无预期

更准确的表述是:

> 在所选参照期和对照组下, 数据没有显示明显的相对处理前趋势变化.

它不能证明预期效应的绝对水平为零, 也不能排除未处理趋势偏离和预期效应变化相互抵消.

### 9.5 无法确定零锚点时应进行敏感性分析 (sensitivity analysis)

敏感性分析至少可以沿三个维度展开:

1. 改变预期窗口长度 $\delta$.
2. 改变预期效应上界 $\Gamma_{g,t}$.
3. 加入或移除不变号, 单调性等形状限制.

若不存在可信的零锚点, 应优先报告部分识别区间, 而不是把某个任意处理前时期当作无污染基线期并报告点估计.

---

## 10. 总结

1. 无预期是对同一单位在不同未来处理路径下潜在结局的跨世界限制:

   $$
   Y_{i,t}(g)
   =
   Y_{i,t}(\infty),
   \qquad t<g.
   $$

2. 无预期不是处理随机化, 也不要求未处理潜在结局与处理时间独立:

   $$
   Y_{i,t}(\infty)
   \not\!\perp\!\!\!\perp
   G_i
   $$

   与无预期可以同时成立.

3. 无预期结合一致性保证处理前观测结局是未处理潜在结局:

   $$
   Y_{i,t}
   =
   Y_{i,t}(\infty),
   \qquad t<G_i.
   $$

   因而无预期本质上是一个干净基线条件.

4. 对无预期的放宽可以按三类信息组织:

   $$
   \begin{array}{lll}
   \text{支集} &\longrightarrow& \text{有限预期},
   \\
   \text{大小} &\longrightarrow& \text{有界预期},
   \\
   \text{形状} &\longrightarrow& \text{单调预期}.
   \end{array}
   $$

5. 处理前趋势主要识别预期效应的变化, 而不是绝对水平:

   $$
   A_t(g)-A_s(g)
   \quad\text{而不是}\quad
   A_t(g).
   $$

   因此, 平坦处理前趋势不等于无预期成立.

6. 在平行趋势成立且对照组干净时, 基线期预期效应直接形成 DiD 偏倚:

   $$
   \operatorname{DiD}(g,t;s,c)
   =
   ATT(g,t)-A_s(g).
   $$
