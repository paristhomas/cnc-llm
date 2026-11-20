# NIST MBE PMI test models (CTC 01-05, FTC 06-11)

Geometry from the NIST "MBE PMI Validation and Conformance Testing Project" (https://go.usa.gov/mGVm), a work of the
US Government (public domain in the US). Copies fetched 2026-11-20 from GitHub mirrors:
`algorithmx/AnalysisSitus` (data/public/cad/nist/NIST_CTC_STEP_PMI) and `BRL-CAD/models` (NIST/*_Definitions).

| Model | Size (mm) | Faces | Distinct feature axes (oblique) | Fit for 3+2 from billet |
|---|---|---|---|---|
| ftc_10 | 158 x 31 x 75 | 214 | 3 (0) | **Good, at native size**: a machined housing with features on several faces (90° indexing) |
| ftc_06 | 305 x 107 x 248 | 144 | 7 (4) | **Good** at about 0.5 scale: a box with angled features |
| ftc_08 | 312 x 223 x 48 | 270 | 6 (3) | **Good** at about 0.5 scale: a frame plate with pockets and angled faces |
| ctc_01 | 1170 x 650 x 150 | 139 | 15 (12) | **Good** at about 0.15 scale: many oblique holes and faces (true 3+2) |
| ctc_04 | 500 x 780 x 131 | 518 | 18 (15) | **Good, but hard**, at about 0.2 scale: a validation candidate |
| ctc_05 | 527 x 559 x 483 | 209 | 5 (2) | Medium: a flange with a tall post (part turning) |
| ftc_11 | 63 x 63 x 3 | 6 | 1 (0) | Too simple |
| ctc_02, ftc_07 | | | | Cast-housing style with drafts and B-splines; skip |
| ctc_03, ftc_09 | | | | Sheet metal; skip |

`overview.png` shows all eleven.
