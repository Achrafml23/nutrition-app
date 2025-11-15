#!/bin/bash
# Define the dictionary as an associative array
declare -A dict

# ! cd into this folders scripts then execute it

dict=(
    [trackables]=Trackable
    [skills_progress]=SkillProgress
    [skills]=Skill
    [assessments]=Assessment
    [entries]=Entry
    [events]=Event
    [wheels]=WheelOfLife
    [routines]=Routine
    [concepts]=Concept
    [avatars]=Avatar
    [journals]=Journal
    [tags]=Tag
    [goals]=Goal
    [reminders]=Reminder
    [tasks]=Task
    [resources]=Resource
    [lifeAreas]=LifeArea
    [insights]=Insight
    [habits]=Habit
)

path=../app/api/routes
items_file="$path/items.py"
# Iterate over the dictionary
for key in "${!dict[@]}"; do
    value="${dict[$key]}"
    # Convert the value to lowercase
    lowercase=$(echo "$value" | tr '[:upper:]' '[:lower:]')
    file="$path/$key.py"

    echo "file: $file"
    touch "$file"
    cat "$items_file" > "$file"
    sed -i -e 's/Item/'$value'/g' -e 's/item/'$lowercase'/g' "$file"
done
