cd /home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work
PY=/home/paris/cnc-llm/.venv/bin/python
for s in ${@:-s1 s2 s3}; do
  $PY gen_$s.py > log_$s.txt 2>&1 || { echo FAIL $s; tail -5 log_$s.txt; exit 1; }
done
$PY gen2.py > log_po.txt 2>&1 || { echo FAIL po; tail -5 log_po.txt; exit 1; }
tail -3 log_po.txt; echo ALLDONE
