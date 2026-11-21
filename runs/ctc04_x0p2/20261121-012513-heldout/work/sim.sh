cd /home/paris/cnc-llm
RUN=/home/paris/cnc-llm/runs/ctc04_x0p2/20261121-012513-heldout
/home/paris/cnc-llm/.venv/bin/python -m cncllm.x5 sim $RUN $RUN/work/program.nc --note $RUN/work/notes.md > $RUN/work/sim_out.txt 2>&1
echo SIMEXIT $? >> $RUN/work/sim_out.txt
