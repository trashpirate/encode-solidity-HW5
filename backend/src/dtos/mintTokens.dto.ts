import { ApiProperty } from "@nestjs/swagger";

export class MintTokensDto {
    @ApiProperty({ type: String, default: 'My Address', required: true})
    address: string;
}