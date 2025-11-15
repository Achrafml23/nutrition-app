"""
# Data Export/Import System - Implementation Guide

## Overview
This system enables GDPR-compliant data portability for users, allowing them to:
- Export all their habits and completion history
- Import data into new or existing accounts
- Migrate between different instances
- Maintain data backups

## GDPR Compliance
This implementation satisfies:
- **Article 20**: Right to data portability
- **Article 15**: Right of access to personal data
- **Recital 68**: Machine-readable format requirement

## API Endpoints

### 1. Export Data (JSON Response)
```
GET /api/data-export/export/habits
```

Query Parameters:
- `include_completions` (bool, default: true): Include completion history
- `include_settings` (bool, default: false): Include user settings
- `start_date` (string, optional): Filter completions from date (ISO format)
- `end_date` (string, optional): Filter completions to date (ISO format)

Response: JSON object with complete user data

Example:
```bash
curl -X GET "https://api.yourdomain.com/data-export/export/habits?include_completions=true" \
  -H "Authorization: Bearer {token}"
```

### 2. Download Export (File Download)
```
GET /api/data-export/export/habits/download
```

Same parameters as above, but returns a downloadable JSON file.

Response: File download with name `uvsu_data_export_{timestamp}.json`

### 3. Import Data
```
POST /api/data-export/import/habits
```

Request Body:
```json
{
  "data": {
    "metadata": {...},
    "habits": [...],
    "completions": [...]
  },
  "options": {
    "include_habits": true,
    "include_completions": true,
    "include_settings": false,
    "skip_duplicates": true,
    "merge_strategy": "skip"
  }
}
```

Merge Strategies:
- `skip`: Skip duplicate habits (default)
- `replace`: Replace existing habits with imported data
- `create_new`: Always create new habits (may result in duplicates)

Response:
```json
{
  "success": true,
  "habits_imported": 15,
  "habits_skipped": 3,
  "completions_imported": 245,
  "completions_skipped": 12,
  "errors": [],
  "warnings": ["Skipped duplicate habit: Morning Run"]
}
```

### 4. Validate Import
```
POST /api/data-export/import/validate
```

Validates import data without actually importing. Useful for preview.

Request Body: Same as import endpoint

Response:
```json
{
  "valid": true,
  "version": "1.0",
  "total_habits": 18,
  "total_completions": 257,
  "issues": [],
  "warnings": ["3 duplicate habit names in export"]
}
```

## Export File Format

### Structure
```json
{
  "metadata": {
    "export_version": "1.0",
    "export_date": "2025-10-07T14:30:00Z",
    "user_id": "uuid",
    "total_habits": 15,
    "total_completions": 245,
    "date_range_start": null,
    "date_range_end": null
  },
  "habits": [
    {
      "name": "Morning Workout",
      "description": "30-minute exercise routine",
      "habit_type": "health",
      "is_keystone": true,
      "difficulty_level": "medium",
      "evidence_level": "strong",
      "levels": {...},
      "timers": {...},
      "frequency": {...},
      "reminders": {...},
      "primary_life_area_name": "Health & Fitness",
      "secondary_life_area_names": ["Personal Growth"],
      "identity_statement_text": "I am someone who prioritizes health",
      "streak": 42,
      "total_skips": 3,
      "total_completions": 87,
      "original_habit_id": "uuid",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-10-07T00:00:00Z"
    }
  ],
  "completions": [
    {
      "original_habit_id": "uuid",
      "completion_date": "2025-10-07",
      "completion_type": "scheduled",
      "level_completed": "max",
      "notes": "Felt great today!",
      "is_skip": false,
      "skip_reason": null,
      "skip_solution": null,
      "redo_count": 0,
      "redo_progression": null,
      "mood_before": 3,
      "mood_after": 5,
      "satisfaction": 5,
      "created_at": "2025-10-07T08:30:00Z"
    }
  ],
  "settings": {
    "quick_add_settings": {...},
    "streak_protection_enabled": true,
    "rest_days": [0, 6]
  }
}
```

## Import Logic

### Habit Import Process
1. Check for duplicate habits (by name)
2. Create/find life areas
3. Create identity statements if provided
4. Create new habit with fresh IDs
5. Map old habit ID to new habit ID
6. Reset statistics (streak, completions) for new account

### Completion Import Process
1. Map completions to new habit IDs
2. Check for duplicate completions (user_id + habit_id + date)
3. Create new completions with timestamps preserved
4. Skip duplicates if `skip_duplicates=true`

### Data Transformations
- **User ID**: Changed to importing user's ID
- **Habit IDs**: New UUIDs generated, mapping maintained
- **Life Areas**: Matched by name or created if missing
- **Identity Statements**: Created as new records
- **Timestamps**: Creation timestamps preserved from export
- **Statistics**: Reset for habits (streak, totals)

## Security Considerations

### Authentication
- All endpoints require JWT authentication
- User can only export their own data
- User can only import to their own account

### Data Validation
- Export version checking
- JSON schema validation
- Relationship integrity checks
- SQL injection prevention via SQLModel

### Rate Limiting
Consider implementing rate limiting:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.get("/export/habits/download")
@limiter.limit("10/hour")
async def download_user_data(...):
    ...
```

## Error Handling

### Common Errors
1. **Invalid JSON**: Malformed export file
2. **Version Mismatch**: Unsupported export version
3. **Missing References**: Completions for non-existent habits
4. **Database Errors**: Constraint violations, connection issues

### Error Response Format
```json
{
  "success": false,
  "habits_imported": 5,
  "habits_skipped": 0,
  "completions_imported": 0,
  "completions_skipped": 0,
  "errors": [
    "Failed to import habit 'Morning Run': Database constraint violation"
  ],
  "warnings": []
}
```

## Testing

### Manual Testing
```python
# Test export
import requests

response = requests.get(
    "http://localhost:8000/api/data-export/export/habits",
    headers={"Authorization": f"Bearer {token}"},
    params={"include_completions": True}
)
export_data = response.json()

# Test import
response = requests.post(
    "http://localhost:8000/api/data-export/import/habits",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "data": export_data,
        "options": {
            "include_habits": True,
            "include_completions": True,
            "skip_duplicates": True
        }
    }
)
result = response.json()
print(f"Imported: {result['habits_imported']} habits")
```

### Unit Test Example
```python
def test_export_habits(client, authenticated_user):
    response = client.get(
        "/api/data-export/export/habits",
        headers=authenticated_user["headers"]
    )

    assert response.status_code == 200
    data = response.json()
    assert "metadata" in data
    assert "habits" in data
    assert data["metadata"]["export_version"] == "1.0"

def test_import_habits(client, authenticated_user, sample_export):
    response = client.post(
        "/api/data-export/import/habits",
        headers=authenticated_user["headers"],
        json={
            "data": sample_export,
            "options": {"skip_duplicates": True}
        }
    )

    assert response.status_code == 200
    result = response.json()
    assert result["success"] is True
    assert result["habits_imported"] > 0
```

## Migration Scenarios

### Scenario 1: New Account Migration
User terminates old account and creates new one:
1. Export data from old account before termination
2. Create new account
3. Import data to new account
4. All habits and history transferred

### Scenario 2: Cross-Instance Migration
Moving from self-hosted to cloud instance:
1. Export from self-hosted instance
2. Create account on cloud instance
3. Import data
4. Verify data integrity

### Scenario 3: Data Backup
Regular backups for disaster recovery:
1. Schedule automated exports (weekly/monthly)
2. Store exports securely (encrypted storage)
3. Test restore process periodically

## Performance Considerations

### Large Datasets
For users with thousands of completions:
- Consider pagination for exports
- Stream large files instead of loading into memory
- Add progress indicators for imports

### Optimization Tips
```python
# Use bulk insert for completions
session.bulk_insert_mappings(HabitCompletion, completion_dicts)

# Batch commit instead of individual commits
for i, habit in enumerate(habits):
    session.add(habit)
    if i % 100 == 0:
        session.commit()
session.commit()
```

## Future Enhancements

### Planned Features
1. **Selective Export**: Export specific habits or date ranges
2. **Incremental Import**: Import only new data, skip existing
3. **Data Merge**: Intelligent merging of overlapping data
4. **Format Conversion**: Support CSV, Excel formats
5. **Scheduled Exports**: Automated recurring exports
6. **Cloud Backup**: Direct backup to cloud storage

### API Versioning
As the export format evolves:
- Maintain backward compatibility
- Support multiple export versions
- Provide migration tools for old formats

## Compliance Documentation

### For GDPR Audit
Document that your system provides:
✅ **Right to data portability** (Article 20)
- Machine-readable format (JSON)
- Structured data format
- Complete personal data included
- No vendor lock-in

✅ **Right of access** (Article 15)
- User can access all their data
- Data provided without delay
- Free of charge

### Privacy Policy Text
Include this in your privacy policy:
```
You have the right to receive your personal data in a structured,
commonly used, and machine-readable format. You can export your
data at any time from the Data Management section of your account
settings. This export includes all your habits, completion history,
and settings.
```

## Support & Troubleshooting

### Common Issues

**Issue**: "Invalid export file format"
**Solution**: Ensure file is valid JSON and matches export schema

**Issue**: "Duplicate habits skipped"
**Solution**: Expected behavior. Change merge_strategy to "create_new" if duplicates desired

**Issue**: "Completions not imported"
**Solution**: Ensure corresponding habits were successfully imported first

### Debug Mode
Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Add to import function
logger.debug(f"Importing habit: {habit_data.name}")
logger.debug(f"Mapped habit IDs: {habit_id_map}")
```
"""
