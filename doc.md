# Docs

Brief Description of the application

## Database schema

User:
| Attribute | Description |
| ----- | ------- |
| id | string |
| name | string |
| email | string |
| password | string |
| profilePicUrl | string |
| identityKey | string |
| signedPreKey | string |
| oneTimeKeys | string[] |
| createdAt | date |
| updatedAt | date |

Chat:
| Attribute | Description |
| ----- | ------- |
| senderID | string |
| receiverID | string |
| senderIdentityKey | string |
| senderEphemeralKey | string |
| receiverIdentityKey | string |
| receiverSignedPreKey | string |
| receiverOneTimeKey? | string |


Message:
| Attribute | Description |
| ----- | ------- |
| receiverID | string |
| senderID | string |
| rootKey | string |
| content | string |
| timestamp | date |

