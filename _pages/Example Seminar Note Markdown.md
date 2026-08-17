---
title: "Seminar Notes — August 17, 2026"
layout: single
permalink: /notes/8f3c7a/
author_profile: true
sitemap: false
noindex: true
toc: true
toc_sticky: true
---

# Seminar Notes — August 17, 2026

> **Unlisted seminar note.**  
> This page is intended for internal sharing via direct link.

## Topic

**Modern Perspectives on Doubly Robust Estimation**

**Date:** August 17, 2026  
**Format:** Seminar discussion  
**Presenter:** Yunhao Zheng

---

## 1. Motivation

A recurring problem in causal inference is that the estimand may be identifiable under relatively weak assumptions, but practical estimation requires nuisance quantities such as

\[
\mu_a(x)=\mathbb E(Y\mid A=a,X=x)
\]

and

\[
e(x)=P(A=1\mid X=x).
\]

If either nuisance model is misspecified, a conventional plug-in estimator may become inconsistent.

Doubly robust methods address this problem by combining the outcome regression and propensity score models in such a way that consistency can survive misspecification of one of them.

---

## 2. Main estimand

Consider the average treatment effect

\[
\psi
=
\mathbb E\left[
Y(1)-Y(0)
\right].
\]

Under consistency, exchangeability,

\[
Y(a)\perp A\mid X,
\]

and positivity,

\[
0<P(A=1\mid X)<1,
\]

the estimand is identified by

\[
\psi
=
\mathbb E[
\mu_1(X)-\mu_0(X)
].
\]

---

## 3. AIPW estimator

The augmented inverse probability weighted estimator can be written as

\[
\hat\psi
=
\frac1n
\sum_{i=1}^n
\left[
\hat\mu_1(X_i)
-
\hat\mu_0(X_i)
+
\frac{A_i}{\hat e(X_i)}
\{Y_i-\hat\mu_1(X_i)\}
-
\frac{1-A_i}{1-\hat e(X_i)}
\{Y_i-\hat\mu_0(X_i)\}
\right].
\]

The important point is that this is not merely an arbitrary combination of regression adjustment and IPW.

It arises naturally from the efficient influence function.

---

## 4. Main intuition

The key seminar discussion was:

> **Doubly robust estimation is better understood as bias correction than as “using two models.”**

The plug-in estimator

\[
\frac1n\sum_i
\{
\hat\mu_1(X_i)-\hat\mu_0(X_i)
\}
\]

contains bias caused by errors in estimating the conditional mean.

The augmentation terms

\[
\frac{A}{e(X)}\{Y-\mu_1(X)\}
\]

and

\[
\frac{1-A}{1-e(X)}
\{Y-\mu_0(X)\}
\]

act as first-order corrections.

This perspective connects AIPW directly to influence-function-based estimation.

---

## 5. Why “double robustness” occurs

Let

\[
\hat\mu_a-\mu_a
\]

denote the outcome-model error and

\[
\hat e-e
\]

the propensity-score error.

After the first-order correction, the remaining bias is approximately a **product of nuisance errors**:

\[
\operatorname{Bias}
\approx
(\hat\mu-\mu)(\hat e-e).
\]

Therefore, if either

\[
\hat\mu=\mu
\]

or

\[
\hat e=e,
\]

the leading bias disappears.

This is the algebraic origin of double robustness.

---

## 6. Connection to modern DML

The more modern interpretation is stronger than classical double robustness.

Suppose

\[
\|\hat\mu-\mu\|
=
o_p(n^{-1/4})
\]

and

\[
\|\hat e-e\|
=
o_p(n^{-1/4}).
\]

Then

\[
\|\hat\mu-\mu\|
\,
\|\hat e-e\|
=
o_p(n^{-1/2}),
\]

so the nuisance-estimation error becomes negligible relative to the parametric \(n^{-1/2}\) scale.

This allows flexible machine-learning estimators to be used for nuisance functions while retaining asymptotically normal inference.

Cross-fitting is then used to weaken empirical-process restrictions caused by estimating and evaluating nuisance models on the same observations.

---

## 7. Discussion points

### 7.1 DR is not the same as efficiency

Double robustness concerns consistency under nuisance-model misspecification.

Semiparametric efficiency concerns attaining the smallest asymptotic variance within a statistical model.

These are related but conceptually different properties.

### 7.2 AIPW and one-step estimation

AIPW can be understood as a one-step estimator:

\[
\hat\psi_{\mathrm{one-step}}
=
\psi(\hat P)
+
P_n D_{\hat P},
\]

where \(D_{\hat P}\) is the estimated influence function.

This interpretation is often more useful than memorizing the AIPW formula.

### 7.3 The real object is the score / influence function

A useful conceptual workflow is

\[
\text{Estimand}
\rightarrow
\text{Identification}
\rightarrow
\text{EIF}
\rightarrow
\text{Estimator}
\rightarrow
\text{Inference}.
\]

Rather than beginning with an estimator and asking why it works, derive the relevant influence function first.

---

## 8. Questions that remain open

1. When exactly does Neyman orthogonality imply double robustness?
2. Is every doubly robust estimator associated with an orthogonal score?
3. How should we distinguish EIF-based AIPW from more general orthogonal estimating equations?
4. What changes when the target parameter is not pathwise differentiable?
5. How does TMLE differ conceptually from one-step estimation once both use the same EIF?

---

## 9. My takeaway

The most useful conceptual shift from today's seminar is:

> **AIPW should not primarily be viewed as “outcome regression + IPW.” It should be viewed as a first-order debiasing procedure derived from the geometry of the statistical model.**

The classical “two models, one may be wrong” interpretation explains robustness.

The influence-function interpretation explains **why the estimator has this form**, how to generalize it to new estimands, and why the same structure appears throughout modern semiparametric statistics and double machine learning.

---

## References

- Robins, Rotnitzky, and Zhao. Semiparametric regression for repeated outcomes.
- van der Laan and Robins. *Unified Methods for Censored Longitudinal Data and Causality*.
- van der Vaart. *Asymptotic Statistics*.
- Chernozhukov et al. Double/debiased machine learning for treatment and structural parameters.

---

*Last updated: August 17, 2026.*