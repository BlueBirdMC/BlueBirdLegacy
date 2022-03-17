/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");
const fs = require("fs");
const Path = require("path");

class AvailableActorIdentifiers extends DataPacket {
    static NETWORK_ID = ProtocolInfo.AVAILABLE_ACTOR_IDENTIFIERS;

    static HARDCODED_NBT_BLOB = "CgAJBmlkbGlzdArkAQgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBVtaW5lY3JhZnQ6dmlsbGFnZXJfdjIDA3JpZOYBAQpzdW1tb25hYmxlAAAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQNbWluZWNyYWZ0OmNhdAMDcmlklgEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBBtaW5lY3JhZnQ6dHVydGxlAwNyaWSUAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkEW1pbmVjcmFmdDpjaGlja2VuAwNyaWQUAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQNbWluZWNyYWZ0OnBpZwMDcmlkGAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkD21pbmVjcmFmdDpzaGVlcAMDcmlkGgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkDm1pbmVjcmFmdDp3b2xmAwNyaWQcAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQSbWluZWNyYWZ0OnZpbGxhZ2VyAwNyaWQeAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQTbWluZWNyYWZ0Om1vb3Nocm9vbQMDcmlkIAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkD21pbmVjcmFmdDpzcXVpZAMDcmlkIgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkEG1pbmVjcmFmdDpyYWJiaXQDA3JpZCQBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZA1taW5lY3JhZnQ6YmF0AwNyaWQmAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQSbWluZWNyYWZ0Om1pbmVjYXJ0AwNyaWSoAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkFG1pbmVjcmFmdDppcm9uX2dvbGVtAwNyaWQoAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQQbWluZWNyYWZ0Om9jZWxvdAMDcmlkLAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkD21pbmVjcmFmdDpob3JzZQMDcmlkLgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkD21pbmVjcmFmdDpsbGFtYQMDcmlkOgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFG1pbmVjcmFmdDpwb2xhcl9iZWFyAwNyaWQ4AQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQSbWluZWNyYWZ0Omd1YXJkaWFuAwNyaWRiAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQPbWluZWNyYWZ0OnBhbmRhAwNyaWTiAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkEG1pbmVjcmFmdDpwYXJyb3QDA3JpZDwBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZA5taW5lY3JhZnQ6aHVzawMDcmlkXgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFm1pbmVjcmFmdDp0cm9waWNhbGZpc2gDA3JpZN4BAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQZbWluZWNyYWZ0OndpdGhlcl9za2VsZXRvbgMDcmlkYAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkDW1pbmVjcmFmdDpjb2QDA3JpZOABAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQZbWluZWNyYWZ0OnpvbWJpZV92aWxsYWdlcgMDcmlkWAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFG1pbmVjcmFmdDpwdWZmZXJmaXNoAwNyaWTYAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkD21pbmVjcmFmdDp3aXRjaAMDcmlkWgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkEG1pbmVjcmFmdDpzYWxtb24DA3JpZNoBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQRbWluZWNyYWZ0OmRvbHBoaW4DA3JpZD4BCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBBtaW5lY3JhZnQ6ZG9ua2V5AwNyaWQwAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQObWluZWNyYWZ0Om11bGUDA3JpZDIBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBhtaW5lY3JhZnQ6c2tlbGV0b25faG9yc2UDA3JpZDQBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBZtaW5lY3JhZnQ6em9tYmllX2hvcnNlAwNyaWQ2AQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQZbWluZWNyYWZ0OmhvcHBlcl9taW5lY2FydAMDcmlkwAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBBtaW5lY3JhZnQ6em9tYmllAwNyaWRAAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQWbWluZWNyYWZ0OnRudF9taW5lY2FydAMDcmlkwgEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBFtaW5lY3JhZnQ6Y3JlZXBlcgMDcmlkQgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkGG1pbmVjcmFmdDpjaGVzdF9taW5lY2FydAMDcmlkxAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBJtaW5lY3JhZnQ6c2tlbGV0b24DA3JpZEQBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBBtaW5lY3JhZnQ6c3BpZGVyAwNyaWRGAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQgbWluZWNyYWZ0OmNvbW1hbmRfYmxvY2tfbWluZWNhcnQDA3JpZMgBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQXbWluZWNyYWZ0OnpvbWJpZV9waWdtYW4DA3JpZEgBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZA9taW5lY3JhZnQ6c2xpbWUDA3JpZEoBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBJtaW5lY3JhZnQ6ZW5kZXJtYW4DA3JpZEwBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBRtaW5lY3JhZnQ6c2lsdmVyZmlzaAMDcmlkTgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFW1pbmVjcmFmdDpjYXZlX3NwaWRlcgMDcmlkUAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkD21pbmVjcmFmdDpnaGFzdAMDcmlkUgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFG1pbmVjcmFmdDptYWdtYV9jdWJlAwNyaWRUAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQPbWluZWNyYWZ0OmJsYXplAwNyaWRWAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQQbWluZWNyYWZ0OndpdGhlcgMDcmlkaAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkHG1pbmVjcmFmdDp6b21iaWVfdmlsbGFnZXJfdjIDA3JpZOgBAQpzdW1tb25hYmxlAAAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQRbWluZWNyYWZ0OmRyb3duZWQDA3JpZNwBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQPbWluZWNyYWZ0OnN0cmF5AwNyaWRcAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQYbWluZWNyYWZ0OmVsZGVyX2d1YXJkaWFuAwNyaWRkAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQebWluZWNyYWZ0OmVsZGVyX2d1YXJkaWFuX2dob3N0AwNyaWTwAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFG1pbmVjcmFmdDp2aW5kaWNhdG9yAwNyaWRyAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQRbWluZWNyYWZ0OnBoYW50b20DA3JpZHQBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBFtaW5lY3JhZnQ6cmF2YWdlcgMDcmlkdgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkFm1pbmVjcmFmdDplbmRlcl9kcmFnb24DA3JpZGoBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBFtaW5lY3JhZnQ6c2h1bGtlcgMDcmlkbAEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkE21pbmVjcmFmdDplbmRlcm1pdGUDA3JpZG4BCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBVtaW5lY3JhZnQ6YXJtb3Jfc3RhbmQDA3JpZHoBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZA5taW5lY3JhZnQ6aXRlbQMDcmlkgAEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZA1taW5lY3JhZnQ6dG50AwNyaWSCAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkF21pbmVjcmFmdDpmYWxsaW5nX2Jsb2NrAwNyaWSEAQEKc3VtbW9uYWJsZQAACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkE21pbmVjcmFmdDp4cF9ib3R0bGUDA3JpZIgBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQQbWluZWNyYWZ0OnhwX29yYgMDcmlkigEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZB1taW5lY3JhZnQ6ZXllX29mX2VuZGVyX3NpZ25hbAMDcmlkjAEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBdtaW5lY3JhZnQ6ZW5kZXJfY3J5c3RhbAMDcmlkjgEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBhtaW5lY3JhZnQ6c2h1bGtlcl9idWxsZXQDA3JpZJgBAQpzdW1tb25hYmxlAAAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQWbWluZWNyYWZ0OmZpc2hpbmdfaG9vawMDcmlkmgEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBltaW5lY3JhZnQ6ZHJhZ29uX2ZpcmViYWxsAwNyaWSeAQEKc3VtbW9uYWJsZQAACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkD21pbmVjcmFmdDphcnJvdwMDcmlkoAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBJtaW5lY3JhZnQ6c25vd2JhbGwDA3JpZKIBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQNbWluZWNyYWZ0OmVnZwMDcmlkpAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBJtaW5lY3JhZnQ6cGFpbnRpbmcDA3JpZKYBAQpzdW1tb25hYmxlAAAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQYbWluZWNyYWZ0OnRocm93bl90cmlkZW50AwNyaWSSAQEKc3VtbW9uYWJsZQAACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkEm1pbmVjcmFmdDpmaXJlYmFsbAMDcmlkqgEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBdtaW5lY3JhZnQ6c3BsYXNoX3BvdGlvbgMDcmlkrAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBVtaW5lY3JhZnQ6ZW5kZXJfcGVhcmwDA3JpZK4BAQpzdW1tb25hYmxlAAAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQUbWluZWNyYWZ0OmxlYXNoX2tub3QDA3JpZLABAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQWbWluZWNyYWZ0OndpdGhlcl9za3VsbAMDcmlksgEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZCBtaW5lY3JhZnQ6d2l0aGVyX3NrdWxsX2Rhbmdlcm91cwMDcmlktgEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZA5taW5lY3JhZnQ6Ym9hdAMDcmlktAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBhtaW5lY3JhZnQ6bGlnaHRuaW5nX2JvbHQDA3JpZLoBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQYbWluZWNyYWZ0OnNtYWxsX2ZpcmViYWxsAwNyaWS8AQEKc3VtbW9uYWJsZQAACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkFG1pbmVjcmFmdDpsbGFtYV9zcGl0AwNyaWTMAQEKc3VtbW9uYWJsZQAACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkG21pbmVjcmFmdDphcmVhX2VmZmVjdF9jbG91ZAMDcmlkvgEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBptaW5lY3JhZnQ6bGluZ2VyaW5nX3BvdGlvbgMDcmlkygEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBptaW5lY3JhZnQ6ZmlyZXdvcmtzX3JvY2tldAMDcmlkkAEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBhtaW5lY3JhZnQ6ZXZvY2F0aW9uX2ZhbmcDA3JpZM4BAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQbbWluZWNyYWZ0OmV2b2NhdGlvbl9pbGxhZ2VyAwNyaWTQAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkDW1pbmVjcmFmdDp2ZXgDA3JpZNIBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQSbWluZWNyYWZ0OnBpbGxhZ2VyAwNyaWTkAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkDm1pbmVjcmFmdDpnb2F0AwNyaWSAAgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkFG1pbmVjcmFmdDpnbG93X3NxdWlkAwNyaWSCAgEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkD21pbmVjcmFmdDphZ2VudAMDcmlkcAEKc3VtbW9uYWJsZQAACANiaWQAAQtoYXNzcGF3bmVnZwAIAmlkEm1pbmVjcmFmdDppY2VfYm9tYgMDcmlk1AEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cACAJpZBFtaW5lY3JhZnQ6YmFsbG9vbgMDcmlk1gEBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZA1taW5lY3JhZnQ6bnBjAwNyaWRmAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQXbWluZWNyYWZ0OnRyaXBvZF9jYW1lcmEDA3JpZHwBCnN1bW1vbmFibGUAAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZA1taW5lY3JhZnQ6Y293AwNyaWQWAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQQbWluZWNyYWZ0OnpvZ2xpbgMDcmlk/AEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBZtaW5lY3JhZnQ6cGlnbGluX2JydXRlAwNyaWT+AQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkDW1pbmVjcmFmdDpiZWUDA3JpZPQBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQabWluZWNyYWZ0OndhbmRlcmluZ190cmFkZXIDA3JpZOwBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAAgCaWQUbWluZWNyYWZ0OnNub3dfZ29sZW0DA3JpZCoBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZA1taW5lY3JhZnQ6Zm94AwNyaWTyAQEKc3VtbW9uYWJsZQEACANiaWQAAQtoYXNzcGF3bmVnZwEIAmlkEG1pbmVjcmFmdDpob2dsaW4DA3JpZPgBAQpzdW1tb25hYmxlAQAIA2JpZAABC2hhc3NwYXduZWdnAQgCaWQQbWluZWNyYWZ0OnBpZ2xpbgMDcmlk9gEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBFtaW5lY3JhZnQ6c3RyaWRlcgMDcmlk+gEBCnN1bW1vbmFibGUBAAgDYmlkAAELaGFzc3Bhd25lZ2cBCAJpZBFtaW5lY3JhZnQ6YXhvbG90bAMDcmlkhAIBCnN1bW1vbmFibGUBAAgDYmlkCm1pbmVjcmFmdDoBC2hhc3NwYXduZWdnAAgCaWQQbWluZWNyYWZ0OnBsYXllcgMDcmlkggQBCnN1bW1vbmFibGUAAAA=";

    encodePayload() {
        this.write(Buffer.from(AvailableActorIdentifiers.HARDCODED_NBT_BLOB, "base64"));
        // this.write(this.namedtag ? this.namedtag : Buffer.from(fs.readFileSync(Path.normalize(__dirname + "/../../../resources/entity_identifiers.nbt")), "base64"));
    }
}

module.exports = AvailableActorIdentifiers;