#!/usr/bin/env bash
set -euo pipefail

cd /Users/aliak/Documents/Claude/Projects/IOI_PROJECT

files=(
  domino-tracker/docs/migration-analysis/Blueprint/IT/IAL1_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/IAL2_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/IAL3_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/ITDR2_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/ITDR_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/ITI_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPAMR_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPCA_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPCR_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPDRP_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPSLCF_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPSOF2_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SAPTR_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/SFAR_blueprint.md
  domino-tracker/docs/migration-analysis/Blueprint/IT/UR_blueprint.md
)

total=0
marker_pass=0
marker_fail=0
order_pass=0
order_fail=0
status_pass=0
status_fail=0
pending_count=0

: > /tmp/it_audit_findings.txt

for f in "${files[@]}"; do
  total=$((total+1))

  if bash domino-tracker/scripts/check-markers.sh "$f" >/tmp/marker.out 2>&1; then
    marker_pass=$((marker_pass+1))
  else
    marker_fail=$((marker_fail+1))
    echo "CRITICAL|$f|marker|$(tail -n 2 /tmp/marker.out | tr '\n' ' ')" >> /tmp/it_audit_findings.txt
  fi

  l1=$(rg -n "^## Blueprint Status$" "$f" | head -n1 | cut -d: -f1 || true)
  l2=$(rg -n "^## Form Identity$" "$f" | head -n1 | cut -d: -f1 || true)
  l3=$(rg -n "^## Purpose$" "$f" | head -n1 | cut -d: -f1 || true)
  l4=$(rg -n "^## SharePoint Schema$" "$f" | head -n1 | cut -d: -f1 || true)
  l5=$(rg -n "^## Workflow Stage Map$" "$f" | head -n1 | cut -d: -f1 || true)
  l6=$(rg -n "^## Role Matrix$" "$f" | head -n1 | cut -d: -f1 || true)
  l7=$(rg -n "^## Power Automate Actions$" "$f" | head -n1 | cut -d: -f1 || true)
  l8=$(rg -n "^## Screen Inventory$" "$f" | head -n1 | cut -d: -f1 || true)
  l9=$(rg -n "^## Navigation Map$" "$f" | head -n1 | cut -d: -f1 || true)
  l10=$(rg -n "^## Migration Risks & Notes$" "$f" | head -n1 | cut -d: -f1 || true)
  l11=$(rg -n "^## v3 Impossibilities$" "$f" | head -n1 | cut -d: -f1 || true)
  l12=$(rg -n "^## Reference PDF$" "$f" | head -n1 | cut -d: -f1 || true)
  l13=$(rg -n "^## Architect Verification Checklist$" "$f" | head -n1 | cut -d: -f1 || true)

  ok=1
  for v in "$l1" "$l2" "$l3" "$l4" "$l5" "$l6" "$l7" "$l8" "$l9" "$l10" "$l11" "$l12" "$l13"; do
    if [[ -z "$v" ]]; then
      ok=0
      break
    fi
  done

  if [[ "$ok" -eq 1 ]] && [[ "$l1" -lt "$l2" ]] && [[ "$l2" -lt "$l3" ]] && [[ "$l3" -lt "$l4" ]] && [[ "$l4" -lt "$l5" ]] && [[ "$l5" -lt "$l6" ]] && [[ "$l6" -lt "$l7" ]] && [[ "$l7" -lt "$l8" ]] && [[ "$l8" -lt "$l9" ]] && [[ "$l9" -lt "$l10" ]] && [[ "$l10" -lt "$l11" ]] && [[ "$l11" -lt "$l12" ]] && [[ "$l12" -lt "$l13" ]]; then
    order_pass=$((order_pass+1))
  else
    order_fail=$((order_fail+1))
    echo "MAJOR|$f|sections|order or required heading missing" >> /tmp/it_audit_findings.txt
  fi

  c=$(rg -n "Lifecycle Status|Architect Checklist|Sentinel Validation|Craftsman Build|QA Approval|Deployment" "$f" | wc -l | tr -d ' ')
  if [[ "$c" -ge 6 ]]; then
    status_pass=$((status_pass+1))
  else
    status_fail=$((status_fail+1))
    echo "MAJOR|$f|status|missing required blueprint status fields" >> /tmp/it_audit_findings.txt
  fi

  pend=$(rg -n "Pending Sentinel verification|To be verified|Not Yet Claimed" "$f" | head -n1 || true)
  if [[ -n "$pend" ]]; then
    pending_count=$((pending_count+1))
    echo "MINOR|$f|pending|$pend" >> /tmp/it_audit_findings.txt
  fi
done

echo "TOTAL:$total"
echo "MARKER_PASS:$marker_pass"
echo "MARKER_FAIL:$marker_fail"
echo "SECTION_ORDER_PASS:$order_pass"
echo "SECTION_ORDER_FAIL:$order_fail"
echo "STATUS_FIELDS_PASS:$status_pass"
echo "STATUS_FIELDS_FAIL:$status_fail"
echo "PENDING_METADATA:$pending_count"
echo "---FINDINGS---"
if [[ -s /tmp/it_audit_findings.txt ]]; then
  cat /tmp/it_audit_findings.txt
else
  echo "NONE"
fi
