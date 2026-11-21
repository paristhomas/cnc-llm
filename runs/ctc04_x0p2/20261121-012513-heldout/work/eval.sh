cd /home/paris/cnc-llm
MILLBILL_DIR=/home/paris/millbill /home/paris/cnc-llm/.venv/bin/python -m cncllm.x5 evaluate /home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout > /home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work/eval_out.txt 2>&1
echo EVALEXIT $? >> /home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout/work/eval_out.txt
